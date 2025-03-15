
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, ShoppingBag, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Get Stripe publishable key from environment
const stripePromise = loadStripe('pk_test_sample'); // Replace with actual publishable key

const CheckoutPage = () => {
  const { search } = useLocation();
  const [clientSecret, setClientSecret] = useState('');
  const [productId, setProductId] = useState('');
  const [streamId, setStreamId] = useState('');
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const secret = params.get('clientSecret');
    const pid = params.get('productId');
    const sid = params.get('streamId');

    if (!secret || !pid) {
      setPageError('Missing required checkout information');
      setLoading(false);
      return;
    }

    setClientSecret(secret);
    setProductId(pid);
    if (sid) setStreamId(sid);

    const fetchProductDetails = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', pid)
          .single();

        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setPageError('Failed to load product information');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [search]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to complete your purchase</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={() => navigate('/login?redirect=' + encodeURIComponent(window.location.pathname + window.location.search))}
            >
              Sign In to Continue
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-app-yellow"></div>
      </div>
    );
  }

  if (pageError || !product) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10">
        <Card className="border-red-300">
          <CardHeader>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <CardTitle className="text-xl font-bold">Error</CardTitle>
            </div>
            <CardDescription>{pageError || 'Product not found'}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => navigate('/live')}
            >
              Return to Live Streams
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 pt-6 min-h-[calc(100vh-64px)]">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Stream
        </Button>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Left side - Product information */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start mb-4">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded-md mr-3"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded-md mr-3">
                    <ShoppingBag className="h-8 w-8 text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                  <div className="mt-1 text-app-yellow font-bold">
                    ${product.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {product.description && (
                <div className="mb-4 text-sm text-gray-600">
                  {product.description}
                </div>
              )}

              <Separator className="my-4" />

              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span className="text-app-yellow">${product.price.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Payment form */}
        <div className="md:col-span-3">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
              clientSecret={clientSecret} 
              productId={productId} 
              streamId={streamId} 
              userId={user.id}
              totalAmount={product.price}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
};

// Payment form subcomponent
const CheckoutForm = ({ 
  clientSecret, 
  productId, 
  streamId, 
  userId,
  totalAmount
}: { 
  clientSecret: string; 
  productId: string; 
  streamId?: string; 
  userId: string;
  totalAmount: number;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postal_code: '',
    country: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCardChange = (event: any) => {
    setFormComplete(event.complete);
    if (event.error) {
      setPaymentError(event.error.message);
    } else {
      setPaymentError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);
    setPaymentError(null);

    try {
      // Confirm card payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
            address: {
              line1: formData.address,
              city: formData.city,
              postal_code: formData.postal_code,
              country: formData.country
            }
          }
        }
      });

      if (error) {
        throw error;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Create order through edge function
        const { data, error: orderError } = await supabase.functions.invoke('confirm-payment', {
          body: { 
            paymentIntentId: paymentIntent.id,
            userId,
            productId,
            quantity: 1
          }
        });

        if (orderError) throw orderError;

        setPaymentSuccess(true);
        toast({
          title: 'Payment successful',
          description: 'Your order has been placed successfully!',
          duration: 5000
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentError(err.message || 'An error occurred with your payment');
      toast({
        title: 'Payment failed',
        description: err.message || 'An error occurred with your payment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // If payment was successful, show success screen
  if (paymentSuccess) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <CardTitle>Payment Successful!</CardTitle>
          </div>
          <CardDescription>Thank you for your purchase.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your order has been processed successfully. You will be redirected shortly.</p>
          <Button className="w-full" onClick={() => navigate('/profile')}>
            View My Orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          <CardTitle>Payment Details</CardTitle>
        </div>
        <CardDescription>Complete your purchase securely</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  required
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  required
                  placeholder="Postal Code"
                  value={formData.postal_code}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  required
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <Label htmlFor="card-element">Credit Card</Label>
              <div className="p-3 border rounded-md mt-1 bg-white">
                <CardElement
                  id="card-element"
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                  onChange={handleCardChange}
                />
              </div>
              {paymentError && (
                <div className="text-red-500 text-sm mt-2">{paymentError}</div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={!formComplete || !stripe || loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                `Pay $${totalAmount.toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckoutPage;
