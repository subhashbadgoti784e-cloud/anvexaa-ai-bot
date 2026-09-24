import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  ExternalLink,
  Lock,
  ArrowRight,
  Server
} from 'lucide-react';
import { BotConfig } from '../types';

interface WebhookTesterProps {
  config: BotConfig;
}

export const WebhookTester: React.FC<WebhookTesterProps> = ({ config }) => {
  const [hubMode, setHubMode] = useState<string>('subscribe');
  const [hubChallenge, setHubChallenge] = useState<string>('1158201444');
  const [enteredVerifyToken, setEnteredVerifyToken] = useState<string>(config.verifyToken || 'my_secure_whatsapp_verify_token_123');
  
  const [verificationResult, setVerificationResult] = useState<{
    status: number;
    body: string;
    isSuccess: boolean;
    timestamp: string;
  } | null>(null);

  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const handleTestVerification = () => {
    const isSuccess = hubMode === 'subscribe' && enteredVerifyToken === (config.verifyToken || 'my_secure_whatsapp_verify_token_123');
    const result = {
      status: isSuccess ? 200 : 403,
      body: isSuccess ? hubChallenge : 'Verification failed (Token mismatch)',
      isSuccess,
      timestamp: new Date().toLocaleTimeString()
    };
    setVerificationResult(result);
  };

  const copyToClipboard = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(key);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const curlGetCommand = `curl -X GET "http://localhost:8000/webhook?hub.mode=subscribe&hub.challenge=1158201444&hub.verify_token=${config.verifyToken || 'my_secure_whatsapp_verify_token_123'}"`;

  const curlPostCommand = `curl -X POST "http://localhost:8000/webhook" \\
  -H "Content-Type: application/json" \\
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "919876543210",
            "type": "text",
            "text": { "body": "1" }
          }]
        }
      }]
    }]
  }'`;

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-white">Meta Webhook Verification & Handshake Tester</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              GET /webhook
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            When you click "Verify and save" in Meta Developer Portal, Meta sends a GET request with <code className="text-emerald-400">hub.challenge</code> and <code className="text-emerald-400">hub.verify_token</code>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Handshake Simulator (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>Simulate Meta GET /webhook Request</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">FastAPI Endpoint</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1 font-mono">hub.mode</label>
              <input
                type="text"
                value={hubMode}
                onChange={(e) => setHubMode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 font-mono">hub.challenge (Random number from Meta)</label>
              <input
                type="text"
                value={hubChallenge}
                onChange={(e) => setHubChallenge(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 font-mono">
                hub.verify_token (Should match .env VERIFY_TOKEN)
              </label>
              <input
                type="text"
                value={enteredVerifyToken}
                onChange={(e) => setEnteredVerifyToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleTestVerification}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-98"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Meta Verification Handshake</span>
              </button>

              <button
                onClick={() => setEnteredVerifyToken('wrong_token_test')}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700"
                title="Test with wrong token"
              >
                Test Wrong Token
              </button>
            </div>
          </div>

          {/* Verification Result Display */}
          {verificationResult && (
            <div
              className={`p-4 rounded-xl border space-y-2 mt-4 transition-all ${
                verificationResult.isSuccess
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : 'bg-red-950/40 border-red-500/50 text-red-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  {verificationResult.isSuccess ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  )}
                  <span>
                    {verificationResult.isSuccess
                      ? 'Handshake Successful (HTTP 200 OK)'
                      : 'Handshake Rejected (HTTP 403 Forbidden)'}
                  </span>
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  {verificationResult.timestamp}
                </span>
              </div>

              <div className="text-[11px] font-mono bg-slate-950/80 p-2.5 rounded-lg border border-slate-800/80">
                Response Body: <strong className="text-white">{verificationResult.body}</strong>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {verificationResult.isSuccess
                  ? '✅ Token match hua! Meta Developers portal me green checkmark aa jayega aur webhook activate ho jayega.'
                  : '❌ Token mismatch! Meta request reject kar dega. Check karein ki .env me VERIFY_TOKEN aur Meta dashboard me same string ho.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Copyable cURL commands & Meta Setup checklist (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* cURL GET */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Test Webhook GET via Terminal (cURL)</span>
              </span>
              <button
                onClick={() => copyToClipboard(curlGetCommand, 'get')}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
              >
                {copiedCmd === 'get' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd === 'get' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
              {curlGetCommand}
            </pre>
          </div>

          {/* cURL POST */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-teal-400" />
                <span>Simulate Incoming WhatsApp Message POST (cURL)</span>
              </span>
              <button
                onClick={() => copyToClipboard(curlPostCommand, 'post')}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 border border-slate-700"
              >
                {copiedCmd === 'post' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd === 'post' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto max-h-36">
              {curlPostCommand}
            </pre>
          </div>

          {/* Meta Configuration Quick Reference */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <span>Meta App Webhook Settings</span>
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Callback URL:</span>
                <span className="font-mono text-emerald-300">https://your-ngrok-url.ngrok-free.app/webhook</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Verify Token:</span>
                <span className="font-mono text-emerald-300">{config.verifyToken || 'my_secure_whatsapp_verify_token_123'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Webhook Fields to Subscribe:</span>
                <span className="font-mono text-emerald-300">messages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
