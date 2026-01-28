#!/bin/bash

# Deploy Preparation Script
# Copies built files from dist/ to parcel-update/ for deployment
# Excludes source maps and other non-production files

set -e  # Exit on error

DIST_DIR="dist"
DEPLOY_DIR="parcel-update"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Preparing deployment files...${NC}"

# Check if dist directory exists
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${YELLOW}⚠️  dist/ directory not found. Running build first...${NC}"
    npm run build
fi

# Remove old deploy directory if it exists
if [ -d "$DEPLOY_DIR" ]; then
    echo -e "${BLUE}🧹 Cleaning old $DEPLOY_DIR directory...${NC}"
    rm -rf "$DEPLOY_DIR"
fi

# Create deploy directory
mkdir -p "$DEPLOY_DIR"

# Copy files, excluding source maps and other development files
echo -e "${BLUE}📦 Copying production files...${NC}"

# Use rsync to copy with exclusions
# >>> SKIP_ASSETS: Comment out the next two lines to include images/ and style/ <<<
SKIP_IMAGES="--exclude=images"
SKIP_STYLE="--exclude=style"
rsync -av \
    --exclude='*.map' \
    --exclude='*.DS_Store' \
    --exclude='.gitkeep' \
    --exclude='sw.js' \
    $SKIP_IMAGES \
    $SKIP_STYLE \
    "$DIST_DIR/" "$DEPLOY_DIR/"

# Copy service worker file (Parcel puts it in a directory, we need it as a file)
if [ -d "$DIST_DIR/sw.js" ]; then
    echo -e "${BLUE}📋 Copying service worker...${NC}"
    cp "$DIST_DIR/sw.js/"* "$DEPLOY_DIR/sw.js" 2>/dev/null || cp "sw.js" "$DEPLOY_DIR/sw.js"
elif [ -f "$DIST_DIR/sw.js" ]; then
    cp "$DIST_DIR/sw.js" "$DEPLOY_DIR/sw.js"
else
    # Fallback: copy from source
    cp "sw.js" "$DEPLOY_DIR/sw.js"
fi

# Create test.html copy of index.html
echo -e "${BLUE}📋 Creating test.html copy...${NC}"
cp "$DEPLOY_DIR/index.html" "$DEPLOY_DIR/test.html"

# Count files
FILE_COUNT=$(find "$DEPLOY_DIR" -type f | wc -l | tr -d ' ')
TOTAL_SIZE=$(du -sh "$DEPLOY_DIR" | cut -f1)

echo -e "${GREEN}✅ Deployment prep complete!${NC}"
echo -e "${GREEN}📊 Copied $FILE_COUNT files ($TOTAL_SIZE total)${NC}"
echo -e "${GREEN}📁 Ready to deploy from: $DEPLOY_DIR/${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Review files in $DEPLOY_DIR/"
echo -e "  2. Upload contents to your web server"
echo ""
