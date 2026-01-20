import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className="bg-gray-50 text-gray-900 font-sans antialiased">
          {/* --- BEAUTIFUL NAVBAR START --- */}
          <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo Area */}
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className="text-2xl">🏨</span>
                  <h1 className="text-xl font-bold text-blue-600 tracking-wide">
                    Hotel Analytics
                  </h1>
                </div>

                {/* Login/User Button Area */}
                <div>
                  <SignedOut>
                    <div className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                      <SignInButton />
                    </div>
                  </SignedOut>

                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </div>
          </header>
          {/* --- NAVBAR END --- */}

          {/* Main Content Area */}
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
