'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Trash2, Plus, Ruler } from 'lucide-react';

interface Product {
  id: string;
  code: string;
  color: string;
  sleeve: string;
  size: string;
  quantity: number;
}

interface ColorOption {
  value: string;
  label: string;
  emoji: string;
}

interface SleeveOption {
  value: string;
  label: string;
}

const COLOR_OPTIONS: ColorOption[] = [
  { value: 'hitam', label: 'Hitam', emoji: '⚫' },
  { value: 'putih', label: 'Putih', emoji: '⚪' },
  { value: 'hijau', label: 'Hijau', emoji: '🟢' },
  { value: 'navy', label: 'Navy', emoji: '🔵' }
];

const SLEEVE_OPTIONS: SleeveOption[] = [
  { value: 'pendek', label: 'Lengan Pendek' },
  { value: 'panjang', label: 'Lengan Panjang' }
];

const SIZE_OPTIONS = [
  { value: 'S', label: 'S (Small)' },
  { value: 'M', label: 'M (Medium)' },
  { value: 'L', label: 'L (Large)' },
  { value: 'XL', label: 'XL (Extra Large)' },
  { value: 'XXL', label: 'XXL (Double XL)' },
  { value: '3XL', label: '3XL (Triple XL)' },
  { value: '4XL', label: '4XL (Quad XL)' },
  { value: '5XL', label: '5XL (Penta XL)' }
];

const CODE_OPTIONS = [
  { value: '01', label: 'Kode 01' },
  { value: '02', label: 'Kode 02' },
  { value: '03', label: 'Kode 03' },
  { value: '04', label: 'Kode 04' },
  { value: '05', label: 'Kode 05' },
  { value: '06', label: 'Kode 06' },
  { value: '07', label: 'Kode 07' },
  { value: '08', label: 'Kode 08' }
];

function getAvailableColors(code: string): string[] {
  if (code === '01' || code === '02') {
    return ['hitam', 'putih', 'hijau'];
  } else if (['03', '04', '05', '06'].includes(code)) {
    return ['hitam'];
  } else if (code === '07' || code === '08') {
    return ['hitam', 'navy'];
  }
  return [];
}

function getAvailableSleeves(code: string): string[] {
  if (code === '07' || code === '08') {
    return ['panjang']; // Sweater only long sleeve
  }
  return ['pendek', 'panjang'];
}

function formatPhoneNumber(value: string): string {
  let cleanValue = value.replace(/\D/g, '');
  
  if (cleanValue.startsWith('0')) {
    cleanValue = '62' + cleanValue.substring(1);
  } else if (cleanValue.startsWith('8') && !cleanValue.startsWith('62')) {
    cleanValue = '62' + cleanValue;
  } else if (cleanValue.length > 0 && !cleanValue.startsWith('62') && cleanValue.charAt(0) === '8') {
    cleanValue = '62' + cleanValue;
  }
  
  return cleanValue;
}

function SizeChartModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-white text-green-600 border-green-600 hover:bg-green-600 hover:text-white">
          <Ruler className="w-4 h-4 mr-2" />
          📏 Lihat Size Chart
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent text-2xl mb-2">
            Size Chart
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 mb-4">
            Panduan ukuran untuk membantu Anda memilih ukuran yang tepat
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-gradient-to-r from-green-600 to-green-800 text-white">
                <th className="p-3 text-center">Ukuran</th>
                <th className="p-3 text-center">Lebar Dada (cm)</th>
                <th className="p-3 text-center">Panjang Badan (cm)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['S', '45', '66'],
                ['M', '47', '68'],
                ['L', '50', '72'],
                ['XL', '53', '74'],
                ['XXL', '56', '75']
              ].map(([size, chest, length]) => (
                <tr key={size} className="hover:bg-green-50 border-b border-gray-100">
                  <td className="p-3 text-center font-semibold">{size}</td>
                  <td className="p-3 text-center">{chest}</td>
                  <td className="p-3 text-center">{length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-green-600 font-semibold mb-2">Cara Mengukur:</h3>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li><strong>Lebar Dada:</strong> Ukur dari ketiak kiri ke ketiak kanan</li>
            <li><strong>Panjang Badan:</strong> Ukur dari bahu tertinggi hingga ujung bawah</li>
          </ul>
          <p className="mt-2 text-sm italic text-gray-600">
            <strong>Tips:</strong> Pilih ukuran yang lebih besar jika Anda ragu antara dua ukuran
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
  onUpdate: (id: string, updates: Partial<Product>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

function ProductCard({ product, index, onUpdate, onRemove, canRemove }: ProductCardProps) {
  const availableColors = product.code ? getAvailableColors(product.code) : [];
  const availableSleeves = product.code ? getAvailableSleeves(product.code) : [];

  const handleCodeChange = (code: string) => {
    const updates: Partial<Product> = { code };
    
    // Reset color and sleeve if they're no longer available
    const newAvailableColors = getAvailableColors(code);
    const newAvailableSleeves = getAvailableSleeves(code);
    
    if (!newAvailableColors.includes(product.color)) {
      updates.color = '';
    }
    
    if (!newAvailableSleeves.includes(product.sleeve)) {
      updates.sleeve = '';
      // Auto-select if only one option available (sweaters)
      if (newAvailableSleeves.length === 1) {
        updates.sleeve = newAvailableSleeves[0];
      }
    }
    
    onUpdate(product.id, updates);
  };

  return (
    <Card className="mb-4 border-2 border-gray-200 shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Produk {index + 1}</CardTitle>
          {canRemove && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRemove(product.id)}
              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              🗑️ Hapus
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Code Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Kode Kaos <span className="text-red-500">*</span>
            </Label>
            <Select value={product.code} onValueChange={handleCodeChange}>
              <SelectTrigger>
                <SelectValue placeholder="-- Pilih Kode Kaos --" />
              </SelectTrigger>
              <SelectContent>
                {CODE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Size Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Ukuran <span className="text-red-500">*</span>
            </Label>
            <Select value={product.size} onValueChange={(size) => onUpdate(product.id, { size })}>
              <SelectTrigger>
                <SelectValue placeholder="-- Pilih Ukuran --" />
              </SelectTrigger>
              <SelectContent>
                {SIZE_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              Jumlah <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              min="1"
              value={product.quantity}
              onChange={(e) => onUpdate(product.id, { quantity: parseInt(e.target.value) || 1 })}
              className="w-full"
            />
          </div>
        </div>

        {/* Color Selection */}
        <div className="mt-4 space-y-2">
          <Label className="text-sm font-semibold">
            Warna Kaos <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_OPTIONS.map(color => {
              const isAvailable = availableColors.includes(color.value);
              const isSelected = product.color === color.value;
              
              return (
                <button
                  key={color.value}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onUpdate(product.id, { color: color.value })}
                  className={`p-3 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-green-600 to-green-800 text-white border-green-600 transform scale-105 shadow-lg'
                      : isAvailable
                      ? 'bg-white text-gray-700 border-gray-300 hover:border-green-600 hover:bg-green-50 hover:text-green-800 hover:-translate-y-0.5 hover:shadow-md'
                      : 'bg-gray-100 text-gray-400 border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span>{color.emoji}</span>
                  <span>{color.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sleeve Selection */}
        <div className="mt-4 space-y-2">
          <Label className="text-sm font-semibold">
            Jenis Lengan <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {SLEEVE_OPTIONS.map(sleeve => {
              const isAvailable = availableSleeves.includes(sleeve.value);
              const isSelected = product.sleeve === sleeve.value;
              
              return (
                <button
                  key={sleeve.value}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onUpdate(product.id, { sleeve: sleeve.value })}
                  className={`p-3 rounded-lg border-2 font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-green-600 to-green-800 text-white border-green-600 transform scale-105 shadow-lg'
                      : isAvailable
                      ? 'bg-white text-gray-700 border-gray-300 hover:border-green-600 hover:bg-green-50 hover:text-green-800 hover:-translate-y-0.5 hover:shadow-md'
                      : 'bg-gray-100 text-gray-400 border-gray-200 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {sleeve.label}
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OrderSummaryProps {
  customerName: string;
  phone: string;
  products: Product[];
  notes: string;
}

function OrderSummary({ customerName, phone, products, notes }: OrderSummaryProps) {
  const validProducts = products.filter(p => 
    p.code && p.color && p.sleeve && p.size && p.quantity > 0
  );
  
  const totalQuantity = validProducts.reduce((sum, p) => sum + p.quantity, 0);
  
  if (!customerName || !phone || validProducts.length === 0) {
    return null;
  }

  return (
    <Card className="bg-green-50 border-green-200 border-2">
      <CardHeader>
        <CardTitle className="text-green-800">Ringkasan Pesanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between py-1 border-b border-dashed border-gray-300">
          <span>Nama Pemesan:</span>
          <span className="font-semibold">{customerName}</span>
        </div>
        <div className="flex justify-between py-1 border-b border-dashed border-gray-300">
          <span>Telepon:</span>
          <span className="font-semibold">{phone}</span>
        </div>
        
        <div className="space-y-2">
          {validProducts.map((product, index) => (
            <div key={product.id} className="bg-white p-3 rounded-lg border border-green-200">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">Produk {index + 1}</span>
                <span className="font-semibold">{product.quantity} pcs</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <span>Kode: {product.code}</span>
                <span>Ukuran: {product.size}</span>
                <span>Warna: {product.color}</span>
                <span>Lengan: {product.sleeve}</span>
              </div>
            </div>
          ))}
        </div>
        
        {notes && (
          <div className="flex justify-between py-1 border-b border-dashed border-gray-300">
            <span>Catatan:</span>
            <span className="font-semibold text-right max-w-xs">{notes}</span>
          </div>
        )}
        
        <div className="flex justify-between py-2 border-t-2 border-green-300 text-lg text-green-800">
          <span>Total Pesanan:</span>
          <span className="font-semibold">{totalQuantity} pcs</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [nextId, setNextId] = useState(1);

  // Initialize with first product
  useEffect(() => {
    addProduct();
  }, []);

  const addProduct = () => {
    const newProduct: Product = {
      id: `product_${nextId}`,
      code: '',
      color: '',
      sleeve: '',
      size: '',
      quantity: 1
    };
    setProducts(prev => [...prev, newProduct]);
    setNextId(prev => prev + 1);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhoneNumber(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !phone) {
      alert('Mohon lengkapi nama dan nomor telepon!');
      return;
    }
    
    const validProducts = products.filter(p => 
      p.code && p.color && p.sleeve && p.size && p.quantity > 0
    );
    
    if (validProducts.length === 0) {
      alert('Mohon lengkapi minimal satu produk!');
      return;
    }
    
    // Create WhatsApp message
    let message = "PESANAN BARU KAOS\n\n";
    message += `Nama: ${customerName}\n`;
    message += `Telepon: ${phone}\n\n`;
    
    message += "DETAIL PESANAN:\n";
    validProducts.forEach((product, index) => {
      message += `\n${index + 1}. Kode ${product.code}\n`;
      message += `   Warna: ${product.color}\n`;
      message += `   Lengan: ${product.sleeve}\n`;
      message += `   Ukuran: ${product.size}\n`;
      message += `   Jumlah: ${product.quantity} pcs\n`;
    });
    
    const totalQuantity = validProducts.reduce((sum, p) => sum + p.quantity, 0);
    message += `\nTOTAL: ${totalQuantity} pcs\n`;
    
    if (notes) {
      message += `\nCatatan: ${notes}\n`;
    }
    message += `\nWaktu Pemesanan: ${new Date().toLocaleString('id-ID')}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappNumber = "6285184666545";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    setTimeout(() => {
      alert('Form berhasil dikirim! WhatsApp akan terbuka dalam tab baru.\n\nJika WhatsApp tidak terbuka otomatis, silakan copy pesan dan kirim manual.');
    }, 500);
  };

  const isFormValid = customerName && phone && products.some(p => 
    p.code && p.color && p.sleeve && p.size && p.quantity > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-green-600 p-4">
      <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl text-center mb-8 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
          Form Pemesanan Kaos
        </h1>
        
        {/* Info Box */}
        <Card className="mb-6 bg-green-50 border-green-200 border-l-4 border-l-green-600">
          <CardHeader>
            <CardTitle className="text-green-600">Informasi Produk:</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-gray-700">
              <li>• Kode 01-02: Kaos tersedia warna Hitam, Putih, Hijau (lengan panjang/pendek)</li>
              <li>• Kode 03-06: Kaos hanya tersedia warna Hitam (lengan panjang/pendek)</li>
              <li>• Kode 07-08: Sweater tersedia warna Hitam, Navy (hanya lengan panjang)</li>
            </ul>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">
                Nama Pemesan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">
                Nomor Telepon <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="Contoh: 085123456789"
                required
                className="bg-white"
              />
            </div>
          </div>

          {/* Products Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl">Produk yang Dipesan</h3>
              <div className="flex flex-wrap gap-2">
                <SizeChartModal />
                <Button
                  type="button"
                  onClick={addProduct}
                  className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-800 hover:to-green-900 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  ➕ Tambah Produk
                </Button>
              </div>
            </div>

            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onUpdate={updateProduct}
                onRemove={removeProduct}
                canRemove={products.length > 1}
              />
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan Tambahan</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Masukkan catatan khusus jika ada..."
              className="bg-white min-h-20"
            />
          </div>

          {/* Order Summary */}
          <OrderSummary
            customerName={customerName}
            phone={phone}
            products={products}
            notes={notes}
          />

          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-800 hover:to-green-900 text-white py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Pesan Sekarang
          </Button>
        </form>
      </div>
    </div>
  );
}