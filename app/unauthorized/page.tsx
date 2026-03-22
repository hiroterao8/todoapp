export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-center">
        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-slate-800 mb-2">アクセスできません</h1>
        <p className="text-sm text-slate-500 mb-7">
          このアプリは @suswork.jp のアカウント専用です。<br />
          別のアカウントでログインしてください。
        </p>
        <a
          href="/api/auth/signout?callbackUrl=%2Flogin"
          className="block w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl
                     hover:bg-blue-700 transition-colors text-center"
        >
          別のアカウントでログイン
        </a>
      </div>
    </div>
  );
}
