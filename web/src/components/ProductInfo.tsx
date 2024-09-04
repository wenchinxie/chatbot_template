export default function ProductInfo({ className }: { className?: string }) {
  return (
    <div className={`${className} p-4 border rounded-lg`}>
      <h2 className="text-xl font-semibold mb-4">Related Products</h2>
      {/* Add product information here */}
      <p>Product information will be displayed here based on the chat context.</p>
    </div>
  );
}