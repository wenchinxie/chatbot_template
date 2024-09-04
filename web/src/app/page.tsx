import Image from "next/image";
import ChatInterface from "../components/ChatInterface";
import ProductInfo from "../components/ProductInfo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Travel Advice Chat</h1>
      <div className="flex w-full max-w-7xl gap-8">
        <ChatInterface className="flex-grow" />
        <ProductInfo className="w-1/3" />
      </div>
    </main>
  );
}
