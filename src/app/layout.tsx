import ReactQueryProvider from "@/components/ReactQueryProvider";
import { CurrentlyPlayingProvider } from "../contexts/CurrentlyPlayingContext";
import "./globals.css";

export const metadata = {
  title: "E.A.R.S.",
  description: "A field recording archive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <CurrentlyPlayingProvider>{children}</CurrentlyPlayingProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
