#!/usr/bin/env bash
#
# check-no-card-stripes.sh — design-principle regression guard
#
# Forbids decorative left/right border stripes on cards and list rows.
#
# Why this rule exists:
#   - Toss/RootMatch design principle: 카드의 시각 위계는 색상 bg, border,
#     shadow, icon, typography로 표현한다. `border-l-4`로 시작되는 vertical
#     accent stripe는 정보 위계를 깨고 시각적 노이즈를 만든다.
#   - User explicit decision (2026-06-05): "stripe 부분 전부 제거. 앞으로도
#     디자인 원칙으로 절대 없도록 하네스 훅으로 넣어두기."
#
# Usage:
#   pnpm guard:no-card-stripes          # from repo root
#   bash apps/web/scripts/check-no-card-stripes.sh
#
# Exit codes:
#   0  no forbidden patterns found (PASS)
#   1  at least one forbidden pattern found (FAIL)
#
# Scope: apps/web/src/**/*.{ts,tsx}. Skips node_modules, .next, dist, this script.

set -euo pipefail

FORBIDDEN_PATTERNS=(
  'border-l-[1-9][0-9]*'
  'border-r-[1-9][0-9]*'
  'border-l-(primary|success|warning|info|destructive|brand|accent|secondary)'
  'border-r-(primary|success|warning|info|destructive|brand|accent|secondary)'
)

SEARCH_PATH="apps/web/src"

violations=0

echo "[guard:no-card-stripes] Scanning ${SEARCH_PATH} for decorative side-border stripes..."
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
  echo "[guard:no-card-stripes] FAILED — ${violations} forbidden pattern(s) detected."
  echo ""
  echo "Decorative side-border stripes (border-l-4, border-l-primary, etc.) are"
  echo "forbidden by RootMatch design principle. Express visual hierarchy via:"
  echo "  - bg color (bg-accent / bg-success-subtle / bg-muted)"
  echo "  - icon + label (lucide-react icons in a colored chip)"
  echo "  - typography weight (font-bold / font-extrabold)"
  echo "  - border (border + border-color, no border-l-N)"
  echo ""
  echo "Reference: AGENTS.md > Design Principles > No Card Stripes"
  exit 1
fi

echo "[guard:no-card-stripes] PASSED — no decorative stripe regression detected."
exit 0
