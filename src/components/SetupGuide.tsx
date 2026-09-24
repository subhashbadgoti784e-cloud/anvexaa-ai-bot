import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  Key, 
  Globe, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  FileText
} from 'lucide-react';
import { BotConfig } from '../types';

interface SetupGuideProps {
  config: BotConfig;
}

export const SetupGuide: React.FC<SetupGuideProps> = ({ config }) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="py-6 px-4 max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">WhatsApp Bot & Bulk Sender Setup Guide (Hinglish)</h2>
            <p className="text-xs text-emerald-300">Step-by-step local run aur ngrok deploy karne ki poori jaankari</p>
          </div>
        </div>
        <p className="text-xs text-slate-300 max-w-3xl leading-relaxed mt-2">
          Ye guide aapko Meta WhatsApp Cloud API credentials lene, FastAPI webhook chalane, ngrok se public link banane aur CSV se bulk template messages bhejne me madad karegi.
        </p>
      </div>

      {/* Steps Container */}
      <div className="space-y-6">
        {/* Step 1: Meta Developer Account */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                1
              </span>
              <h3 className="text-sm font-bold text-white">Meta Developer Account & WhatsApp API Setup</h3>
            </div>
            <a
              href="https://developers.facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
            >
              <span>Meta Developers Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li><strong className="text-white">developers.facebook.com</strong> par jaakar login karein aur <strong className="text-white">My Apps &gt; Create App</strong> par click karein.</li>
            <li>App type me <strong className="text-white">Other &gt; Business</strong> select karein aur app name daalein.</li>
            <li>Add products page par <strong className="text-emerald-400">WhatsApp</strong> ke neeche <strong className="text-white">Set up</strong> button dabayein.</li>
            <li>Left menu me <strong className="text-white">WhatsApp &gt; API Setup</strong> par click karein.</li>
            <li>
              Yahan aapko 2 cheezein milengi:
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">1. Temporary Access Token</span>
                  <span className="text-emerald-300">WHATSAPP_TOKEN</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">2. Phone number ID</span>
                  <span className="text-teal-300">PHONE_NUMBER_ID (e.g. 109876543210987)</span>
                </div>
              </div>
            </li>
            <li>Neeche <strong className="text-white">To</strong> field me apna personal WhatsApp number add karke OTP verify karein (test messages receive karne ke liye).</li>
          </ol>
        </div>

        {/* Step 2: Install Python dependencies */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              2
            </span>
            <h3 className="text-sm font-bold text-white">Project Dependencies Install Karein</h3>
          </div>

          <p className="text-xs text-slate-300">
            Apne terminal me project directory me jayein aur dependencies install karein:
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
            <button
              onClick={() => copyText('pip install -r requirements.txt', 'pip')}
              className="absolute top-3 right-3 text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800"
            >
              {copiedSnippet === 'pip' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet === 'pip' ? 'Copied' : 'Copy'}</span>
            </button>
            <pre className="text-xs font-mono text-emerald-400">
              pip install -r requirements.txt
            </pre>
          </div>
        </div>

        {/* Step 3: .env file configure karein */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              3
            </span>
            <h3 className="text-sm font-bold text-white">.env File Banayein Aur Tokens Daalein</h3>
          </div>

          <p className="text-xs text-slate-300">
            Project root me <code className="text-emerald-400 font-mono">.env</code> naam ki file banayein aur Meta se mile tokens daalein:
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative">
            <button
              onClick={() =>
                copyText(
                  `WHATSAPP_TOKEN=your_token_here\nPHONE_NUMBER_ID=109876543210987\nVERIFY_TOKEN=my_secure_secret_token_123\nBUSINESS_NAME=Shree Ram Traders\nBUSINESS_LOCATION=Main Market, New Delhi\nGOOGLE_MAPS_LINK=https://maps.google.com\nTEAM_CONTACT_NUMBER=+919876543210`,
                  'env'
                )
              }
              className="absolute top-3 right-3 text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800"
            >
              {copiedSnippet === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet === 'env' ? 'Copied' : 'Copy'}</span>
            </button>
            <pre className="text-[11px] font-mono text-emerald-300 overflow-x-auto space-y-1">
{`# Meta Credentials
WHATSAPP_TOKEN=EAAxxxxxxx...
PHONE_NUMBER_ID=109876543210987
VERIFY_TOKEN=my_secure_secret_token_123

# Business details for Hinglish menu
BUSINESS_NAME=Shree Ram Traders
BUSINESS_LOCATION=Shop No. 12, Main Market, MG Road, New Delhi
GOOGLE_MAPS_LINK=https://maps.google.com/?q=28.6139,77.2090
TEAM_CONTACT_NUMBER=+919876543210`}
            </pre>
          </div>
        </div>

        {/* Step 4: Run Bot & ngrok */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              4
            </span>
            <h3 className="text-sm font-bold text-white">Bot Server Start Karein & ngrok Se Public URL Banayein</h3>
          </div>

          <p className="text-xs text-slate-300">
            Do alag terminal windows open karein:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block font-semibold">Terminal 1: FastAPI Bot</span>
              <pre className="text-xs font-mono text-emerald-400">python main.py</pre>
              <p className="text-[11px] text-slate-500">
                Server port 8000 par start ho jayega: <code className="text-slate-400">http://0.0.0.0:8000</code>
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 block font-semibold">Terminal 2: ngrok Tunnel</span>
              <pre className="text-xs font-mono text-teal-400">ngrok http 8000</pre>
              <p className="text-[11px] text-slate-500">
                ngrok aapko https URL dega, jaise: <br />
                <code className="text-emerald-400">https://abc1234.ngrok-free.app</code>
              </p>
            </div>
          </div>
        </div>

        {/* Step 5: Webhook in Meta Portal */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              5
            </span>
            <h3 className="text-sm font-bold text-white">Meta Developer Dashboard Par Webhook Configure Karein</h3>
          </div>

          <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
            <li>Meta Developers dashboard me <strong className="text-white">WhatsApp &gt; Configuration</strong> par jayein.</li>
            <li><strong className="text-white">Webhook</strong> section me <strong className="text-emerald-400">Edit</strong> par click karein:
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mt-2 space-y-1 font-mono text-[11px]">
                <div><span className="text-slate-400">Callback URL: </span><span className="text-emerald-300">https://abc1234.ngrok-free.app/webhook</span></div>
                <div><span className="text-slate-400">Verify Token: </span><span className="text-emerald-300">my_secure_secret_token_123</span></div>
              </div>
            </li>
            <li><strong className="text-white">Verify and save</strong> par click karein. Aapka server 200 OK challenge return karega aur verify ho jayega!</li>
            <li>Neeche <strong className="text-white">Webhook fields</strong> me <strong className="text-emerald-400">messages</strong> field ko <strong className="text-white">Subscribe</strong> zaroor karein.</li>
          </ol>
        </div>

        {/* Step 6: Bulk Sender */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
              6
            </span>
            <h3 className="text-sm font-bold text-white">Bulk Template Sender Run Karein (bulk.py)</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <p>
              Rule ke hisaab se pehle <strong className="text-amber-300">Test Mode (sirf pehle 3 numbers)</strong> par run karein:
            </p>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Pehle 3 numbers test:</span>
                <code className="text-emerald-400 font-mono font-bold">python bulk.py</code>
              </div>
              <button
                onClick={() => copyText('python bulk.py', 'bulk1')}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800"
              >
                {copiedSnippet === 'bulk1' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <p>
              Jab test verify ho jaye, poori CSV list par chalane ke liye <code className="text-emerald-400">--all</code> flag use karein:
            </p>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 block">Poori list par bhejna:</span>
                <code className="text-teal-400 font-mono font-bold">python bulk.py --all</code>
              </div>
              <button
                onClick={() => copyText('python bulk.py --all', 'bulk2')}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800"
              >
                {copiedSnippet === 'bulk2' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-900/50 text-[11px] text-emerald-200">
              💡 Har message ka send status, error aur WhatsApp message ID automatically <strong className="text-white">log.csv</strong> me save hota hai.
            </div>
          </div>
        </div>

        {/* Step 7: 24/7 Live Bot Deployment */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold flex items-center justify-center text-xs">
              7
            </span>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>24/7 Live Server Par Bot Deploy Karein (Production)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  Always-On
                </span>
              </h3>
              <p className="text-xs text-slate-400">Bina PC on rakhe bot ko internet par 24 ghante chalane ke 3 aasan tareeqe</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Option A: Render.com (Free) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-emerald-400 text-xs">Option A: Render.com</strong>
                <span className="text-[10px] text-slate-500">Free Tier</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                1. Render.com par New Web Service banayein.<br />
                2. Build command: <code className="text-teal-300">pip install -r requirements.txt</code><br />
                3. Start command: <code className="text-teal-300">uvicorn main:app --host 0.0.0.0 --port $PORT</code><br />
                4. Environment variables me apna <code className="text-emerald-300">WHATSAPP_TOKEN</code>, <code className="text-emerald-300">PHONE_NUMBER_ID</code> aur <code className="text-emerald-300">VERIFY_TOKEN</code> daalein.<br />
                5. Render jo HTTPS URL dega (e.g. <code className="text-emerald-300">https://anvexaa-bot.onrender.com/webhook</code>) use Meta Developers Portal me daal dein!
              </p>
            </div>

            {/* Option B: Railway.app */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-teal-400 text-xs">Option B: Railway.app</strong>
                <span className="text-[10px] text-slate-500">1-Click Deploy</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                1. Railway.app par New Project &gt; Deploy from GitHub repo karein.<br />
                2. Variables tab me saare <code className="text-teal-300">.env</code> keys daalein.<br />
                3. Networking tab me Generate Domain click karein.<br />
                4. Generated HTTPS domain ke aage <code className="text-teal-300">/webhook</code> lagakar Meta me verify karein.
              </p>
            </div>

            {/* Option C: Ubuntu VPS / Cloud VM */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <strong className="text-cyan-400 text-xs">Option C: Linux VPS / AWS</strong>
                <span className="text-[10px] text-slate-500">Production VPS</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Systemd service se background me 24/7 run karein:<br />
                <code className="text-cyan-300 block my-1">nohup python3 main.py &gt; bot.log 2&gt;&amp;1 &amp;</code>
                Nginx + Certbot SSL se apna custom domain (e.g. <code className="text-cyan-300">bot.anvexaa.ai/webhook</code>) connect karein.
              </p>
            </div>
          </div>
        </div>

        {/* Step 8: WhatsApp Interactive Options */}
        <div className="bg-slate-900 border border-teal-500/30 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-bold flex items-center justify-center text-xs">
              8
            </span>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>WhatsApp Interactive Quick Reply Buttons & List Menu</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                  type: interactive
                </span>
              </h3>
              <p className="text-xs text-slate-400">Customer ko text type karne ki zaroorat nahi — WhatsApp par click karne ke buttons aate hain</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <p>
              Anvexaa AI bot me Meta WhatsApp Cloud API ke dono official interactive message types integrate kiye gaye hain:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-emerald-400 text-xs">1. Quick Reply Buttons (`send_interactive_buttons`)</h4>
                <p className="text-[11px] text-slate-400">
                  Message ke neeche 3 tap-able buttons dikhte hain (e.g. <strong>[🚀 AI Services]</strong>, <strong>[💰 Pricing]</strong>, <strong>[✨ Free Demo]</strong>). User single tap se select kar sakta hai.
                </p>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-teal-400 text-xs">2. Interactive List Picker (`send_interactive_menu`)</h4>
                <p className="text-[11px] text-slate-400">
                  Ek professional <strong>"Options Dekhein"</strong> button aata hai jise tap karne par poora Anvexaa AI service menu khulta hai (All 4 services with title & description).
                </p>
              </div>
            </div>

            <div className="p-3 bg-teal-950/30 rounded-xl border border-teal-900/50 text-[11px] text-teal-200">
              ✨ <strong>Auto-Fallback Guarantee:</strong> Agar kisi user ke phone me puraana WhatsApp version hai jo interactive buttons support nahi karta, toh bot bina ruke automatically standard Hinglish text menu bhej deta hai!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
