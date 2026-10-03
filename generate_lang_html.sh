#!/bin/bash
# Generate language-specific index files with localized Open Graph tags

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Generating language-specific index files...${NC}"

# Base directory
WEB_DIR="$(dirname "$0")"
cd "$WEB_DIR" || exit 1

# Function to create language-specific HTML
create_lang_html() {
    local lang=$1
    local locale=$2
    local title=$3
    local description=$4
    local output_file="index-${lang}.html"
    
    echo -e "${GREEN}Creating ${output_file}...${NC}"
    
    # Copy main index.html
    cp index.html "$output_file"
    
    # Replace og:title
    sed -i '' "s|<meta property=\"og:title\" content=\"[^\"]*\">|<meta property=\"og:title\" content=\"${title}\">|g" "$output_file"
    
    # Replace og:description
    sed -i '' "s|<meta property=\"og:description\" content=\"[^\"]*\">|<meta property=\"og:description\" content=\"${description}\">|g" "$output_file"
    
    # Replace og:locale (remove alternates, set to specific locale)
    sed -i '' "s|<meta property=\"og:locale\" content=\"en_US\">|<meta property=\"og:locale\" content=\"${locale}\">|g" "$output_file"
    sed -i '' "/<meta property=\"og:locale:alternate\"/d" "$output_file"
    
    # Replace twitter:title
    sed -i '' "s|<meta name=\"twitter:title\" content=\"[^\"]*\">|<meta name=\"twitter:title\" content=\"${title}\">|g" "$output_file"
    
    # Replace twitter:description
    sed -i '' "s|<meta name=\"twitter:description\" content=\"[^\"]*\">|<meta name=\"twitter:description\" content=\"${description}\">|g" "$output_file"
    
    # Replace page title
    sed -i '' "s|<title>[^<]*</title>|<title>${title}</title>|g" "$output_file"
    
    # Replace meta description
    sed -i '' "s|<meta name=\"description\" content=\"[^\"]*\">|<meta name=\"description\" content=\"${description}\">|g" "$output_file"
    
    echo -e "${GREEN}✓ ${output_file} created${NC}"
}

# Russian
create_lang_html "ru" "ru_RU" \
    "Learn.AI - Ваш личный AI помощник в учёбе" \
    "Трансформируйте свой процесс обучения с помощью AI: управление домашними заданиями, мгновенная помощь и умные инструменты для учёбы. Идеально для учащихся всех возрастов."

# German
create_lang_html "de" "de_DE" \
    "Learn.AI - Ihr persönlicher KI-Lernbegleiter" \
    "Verwandeln Sie Ihr Lernerlebnis mit KI-gestützter Hausaufgabenverwaltung, sofortiger Hilfe und intelligenten Lerntools. Perfekt für Schüler jeden Alters."

# Spanish
create_lang_html "es" "es_ES" \
    "Learn.AI - Tu Compañero Personal de Aprendizaje con IA" \
    "Transforma tu experiencia de aprendizaje con gestión de tareas impulsada por IA, ayuda instantánea y herramientas de estudio inteligentes. Perfecto para estudiantes de todas las edades."

# French
create_lang_html "fr" "fr_FR" \
    "Learn.AI - Votre Compagnon d'Apprentissage IA Personnel" \
    "Transformez votre expérience d'apprentissage avec la gestion des devoirs assistée par IA, une aide instantanée et des outils d'étude intelligents. Parfait pour les étudiants de tous âges."

echo -e "${BLUE}Done! Language-specific index files created:${NC}"
ls -1 index-*.html 2>/dev/null || echo "No files created"
