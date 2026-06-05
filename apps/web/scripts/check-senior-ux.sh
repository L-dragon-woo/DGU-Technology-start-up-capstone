#!/usr/bin/env bash
#
# check-senior-ux.sh — Senior-First UX design-principle regression guard
#
# Forbids objectively too-small text sizes for RootMatch's senior user base.
#
# Why this rule exists:
#   - RootMatch 사용 대상은 50대+ 시니어 (뿌리산업 발주처/공장 운영자) 중심.
#   - 노안 + 정밀 터치 한계 고려 시 12px 미만 본문/배지는 가독성 한계.
#   - User explicit decision (2026-06-05):
#     "앞으로 모든 디자인은 사용 대상이 시니어라는 것을 고려하면서 시작하도록
#      하네스 훅으로 추가하기."
#
# Usage:
#   pnpm guard:senior-ux                # from repo root
#   bash apps/web/scripts/check-senior-ux.sh
#
# Exit codes:
#   0  no forbidden patterns found (PASS)
#   1  at least one forbidden pattern found (FAIL)
#
# Scope: apps/web/src/**/*.{ts,tsx}. Skips node_modules, .next, dist.

set -euo pipefail

FORBIDDEN_PATTERNS=(
  'text-\[10px\]'
  'text-\[11px\]'
)

SEARCH_PATH="apps/web/src"

violations=0

echo "[guard:senior-ux] Scanning ${SEARCH_PATH} for objectively-too-small text sizes..."
echo ""

for pattern in "${FORBIDDEN_PATTERNS[@]}"; do
  echo "  Checking: '${pattern}'"

  matches=$(grep -rnE \
    --include='*.ts' \
    --include='*.tsx' \
    --exclude-dir=node_modules \
    --exclude-dir=.next \
    --exclude-dir=dist \
    "${pattern}" \
    "${SEARCH_PATH}" 2>/dev/null || true)

  if [ -n "${matches}" ]; then
    echo "    FAIL — found forbidden pattern '${pattern}':"
    echo "${matches}" | sed 's/^/      /'
    violations=$((violations + 1))
  else
    echo "    OK — clean"
  fi
done

echo ""

if [ "${violations}" -gt 0 ]; then
  echo "[guard:senior-ux] FAILED — ${violations} forbidden pattern(s) detected."
  echo ""
  echo "RootMatch 사용 대상은 50대+ 시니어가 다수입니다."
  echo "text-[10px], text-[11px]는 노안 사용자에게 가독성 한계입니다."
  echo ""
  echo "Use instead:"
  echo "  - 본문/주요 텍스트: text-[15px] ~ text-[17px]"
  echo "  - 보조 텍스트: text-[14px], text-[13px]"
  echo "  - 배지/메타: text-[12px] font-bold"
  echo ""
  echo "Reference: AGENTS.md > Design Principles > Principle 2 (Senior-First UX)"
  exit 1
fi

echo "[guard:senior-ux] PASSED — no senior-UX regression detected."
exit 0
