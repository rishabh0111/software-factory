#!/usr/bin/env bash
# wtree.sh: print a content fingerprint of the current git working tree.
#
# The fingerprint is the tree ID a commit of the working tree, exactly as it
# is on disk now, would get: tracked files with their edits plus untracked
# files that are not ignored. The real index, HEAD and refs are never touched.
#
# Usage: bash wtree.sh            (arguments are ignored)
# Env:   SF_WTREE_OBJECT_DIR      existing dir to receive new git objects
#        TMPDIR                   where the temporary index goes (default /tmp)
# Exit:  0 fingerprint printed, 1 no fingerprint, 130 interrupted

set -u

NAME=wtree.sh
work_dir=""

fail() {
	printf '%s: %s\n' "$NAME" "$*" >&2
	exit 1
}

cleanup() {
	if [ -n "$work_dir" ] && [ -d "$work_dir" ]; then
		rm -rf "$work_dir"
	fi
}

trap cleanup EXIT
trap 'cleanup; trap - EXIT; exit 130' INT TERM

# Absolute form of a path that git reported relative to the top folder.
absolute() {
	case "$1" in
		/* | [A-Za-z]:/* | [A-Za-z]:\\*) printf '%s\n' "$1" ;;
		*) printf '%s/%s\n' "$top" "$1" ;;
	esac
}

# Directory path in the form native git expects (Windows form under MSYS).
native_dir() {
	(cd "$1" 2>/dev/null && { pwd -W 2>/dev/null || pwd; })
}

top=$(git rev-parse --show-toplevel 2>/dev/null) || top=""
[ -n "$top" ] || fail "not inside a git working tree"
cd "$top" || fail "cannot enter $top"

index_path=$(git rev-parse --git-path index 2>/dev/null) || fail "cannot locate the index"
objects_path=$(git rev-parse --git-path objects 2>/dev/null) || fail "cannot locate the object store"
real_index=$(absolute "$index_path")
real_objects=$(absolute "$objects_path")

private_objects=${SF_WTREE_OBJECT_DIR:-}
if [ -n "$private_objects" ]; then
	[ -d "$private_objects" ] || fail "object directory does not exist: $private_objects"
	private_objects=$(native_dir "$private_objects") || fail "cannot read object directory: $SF_WTREE_OBJECT_DIR"
fi

tmp_root=${TMPDIR:-/tmp}
work_dir=$(mktemp -d "$tmp_root/wtree.XXXXXX" 2>/dev/null) || work_dir=""
if [ -z "$work_dir" ] || [ ! -d "$work_dir" ]; then
	work_dir=""
	fail "cannot create a temporary index in $tmp_root; set TMPDIR to a writable directory"
fi
tmp_index="$work_dir/index"

export GIT_INDEX_FILE="$tmp_index"
if [ -n "$private_objects" ]; then
	case "$(uname -s 2>/dev/null)" in
		MINGW* | MSYS*) sep=';' ;;
		*) sep=':' ;;
	esac
	export GIT_OBJECT_DIRECTORY="$private_objects"
	export GIT_ALTERNATE_OBJECT_DIRECTORIES="$real_objects${GIT_ALTERNATE_OBJECT_DIRECTORIES:+$sep$GIT_ALTERNATE_OBJECT_DIRECTORIES}"
fi

# Seed from a copy of the real index so unchanged files skip re-hashing. The
# copy must keep the index mtime, or git's racy-file check could be fooled.
seeded=0
if [ -f "$real_index" ] && cp -p "$real_index" "$tmp_index" 2>/dev/null; then
	if [ ! "$tmp_index" -nt "$real_index" ] && [ ! "$real_index" -nt "$tmp_index" ]; then
		seeded=1
	else
		rm -f "$tmp_index"
	fi
else
	rm -f "$tmp_index"
fi
if [ "$seeded" -eq 0 ]; then
	msg=$(git read-tree HEAD 2>&1) || fail "cannot seed index from HEAD: $(printf '%s\n' "$msg" | head -n 1)"
fi

msg=$(git add -A -- . 2>&1) || fail "staging failed: $(printf '%s\n' "$msg" | head -n 1)"

tree=$(git write-tree 2>&1) || fail "tree write failed: $(printf '%s\n' "$tree" | head -n 1)"
case "$tree" in
	*[!0-9a-f]* | '') fail "unexpected tree id: $(printf '%s\n' "$tree" | head -n 1)" ;;
esac
[ "${#tree}" -eq 40 ] || [ "${#tree}" -eq 64 ] || fail "unexpected tree id: $tree"

printf '%s\n' "$tree" || exit 1
exit 0
