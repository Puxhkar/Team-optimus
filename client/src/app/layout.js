import './globals.css';
import Navbar from '../components/Navbar';
import { Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Mess Management System',
  description: 'Order food, manage subscriptions, and more.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <Navbar />
        <main className="container" style={{ padding: '20px 0' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
