#!/data/data/com.termux/files/usr/bin/bash
# =================================================================
# Anvexaa AI - WhatsApp Cloud API Bot Runner for Android (Termux)
# =================================================================

echo "======================================================"
echo "🚀 Starting Anvexaa AI WhatsApp Bot on Android (Termux)..."
echo "======================================================"

# 1. Update packages
echo "📦 Updating Termux repositories..."
pkg update -y

# 2. Install Python if not present
if ! command -v python3 &> /dev/null
then
    echo "🐍 Installing Python..."
    pkg install python -y
fi

# 3. Install required pip dependencies
echo "📥 Installing dependencies (FastAPI, Requests, Uvicorn)..."
pip install fastapi uvicorn requests python-dotenv pydantic

# 4. Check .env file
if [ ! -f .env ]; then
    echo "⚙️ Creating .env from .env.example..."
    cp .env.example .env
    echo "⚠️ Kripya .env file mein apna WHATSAPP_TOKEN aur PHONE_NUMBER_ID edit karein: nano .env"
fi

echo ""
echo "Select mode:"
echo "1) Start FastAPI WhatsApp Webhook Bot (Port 8000)"
echo "2) Run CSV Bulk Sender (Test Mode - 3 numbers)"
echo "3) Run CSV Bulk Sender (Full Broadcast - All numbers)"
echo "4) Exit"
echo ""

read -p "Enter choice (1-4): " choice

case $choice in
    1)
        echo "🚀 Starting Webhook Server on Android..."
        python main.py
        ;;
    2)
        echo "🧪 Running Bulk Sender in Safety Test Mode (3 numbers)..."
        python bulk.py --direct-text --msg 1
        ;;
    3)
        echo "🚀 Running Bulk Sender on ALL numbers..."
        python bulk.py --direct-text --msg 2 --all
        ;;
    *)
        echo "Exiting."
        ;;
esac
