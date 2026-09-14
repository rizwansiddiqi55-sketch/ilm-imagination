import type {Metadata} from 'next';import './globals.css';
export const metadata:Metadata={title:'Ilm & Imagination | Learn • Explore • Imagine',description:'A bilingual English and Urdu learning magazine for curious minds aged 10–16.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
