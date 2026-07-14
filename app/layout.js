export const metadata = {
  title: 'Vish Project — Inventory Intelligence',
  description: 'MRO spare-parts inventory management dashboard'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, overflow: 'hidden', background: '#101713' }}>{children}</body>
    </html>
  );
}
