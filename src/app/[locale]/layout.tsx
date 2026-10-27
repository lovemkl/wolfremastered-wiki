import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";
import { hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { ThemeProvider } from "next-themes";
import { JsonLd, SiteFooter, SiteHeader } from "@/components/site";
import { routing } from "@/i18n/routing";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Playfair_Display({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-display" });

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const CID = process.env.NEXT_PUBLIC_CLARITY_ID;
const AD_KEY = process.env.NEXT_PUBLIC_AD_NATIVE_BANNER;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wolfamongusremastered.wiki";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const image = `${siteUrl}/images/hero.webp`;
  return {
    metadataBase: new URL(siteUrl),
    title: { default: "The Wolf Among Us Remastered Wiki", template: "%s" },
    description: "Fan wiki for The Wolf Among Us Remastered — the Telltale noir adventure remaster: story guides, characters, choices, Noir Mode and achievements.",
    openGraph: { type: "website", locale, url: siteUrl, siteName: "The Wolf Among Us Remastered Wiki", images: [{ url: image }] },
    twitter: { card: "summary_large_image", images: [image] },
    alternates: { canonical: siteUrl, languages: { en: siteUrl, es: siteUrl + "/es", pt: siteUrl + "/pt", de: siteUrl + "/de", "x-default": siteUrl } },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "The Wolf Among Us Remastered Wiki",
    url: siteUrl,
    logo: `${siteUrl}/android-chrome-512x512.png`,
    image: `${siteUrl}/images/hero.webp`,
  };

  return (
    <html lang={locale} className={`${inter.variable} ${display.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <NextIntlClientProvider messages={messages}>
            <JsonLd data={organization} />
            <SiteHeader locale={locale} />
            {children}
            <SiteFooter locale={locale} />
          </NextIntlClientProvider>
        </ThemeProvider>
      
      {GA_ID && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" /><Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}</Script></>}
      {CID && <Script id="clarity" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CID}");`}</Script>}
      {AD_KEY && <div id="ad-native-hero" className="container max-w-2xl mx-auto my-6 min-h-[90px]" />}
      {AD_KEY && <Script id="ad-native" strategy="afterInteractive">{`(function(){var s=document.createElement('script');s.type='text/javascript';s.async=true;s.src="https://pl31197087.profitableratecpmnetwork.com/${AD_KEY}/invoke.js";var c=document.getElementById('ad-native-hero');if(c)c.appendChild(s);})();`}</Script>}
    </body>
    </html>
  );
}
