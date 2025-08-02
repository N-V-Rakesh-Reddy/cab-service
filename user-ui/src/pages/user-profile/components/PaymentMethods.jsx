import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PaymentMethods = ({ paymentMethods, onSave, className = '' }) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const savedCards = [
    {
      id: 1,
      type: 'visa',
      lastFour: '4532',
      expiryDate: '12/26',
      isDefault: true,
      cardholderName: 'John Doe'
    },
    {
      id: 2,
      type: 'mastercard',
      lastFour: '8901',
      expiryDate: '08/25',
      isDefault: false,
      cardholderName: 'John Doe'
    }
  ];

  const digitalWallets = [
    { id: 'paytm', name: 'Paytm', icon: 'Wallet', connected: true },
    { id: 'googlepay', name: 'Google Pay', icon: 'Smartphone', connected: true },
    { id: 'phonepe', name: 'PhonePe', icon: 'CreditCard', connected: false },
    { id: 'amazonpay', name: 'Amazon Pay', icon: 'ShoppingBag', connected: false }
  ];

  const getCardIcon = (type) => {
    const icons = {
      'visa': 'CreditCard',
      'mastercard': 'CreditCard',
      'amex': 'CreditCard',
      'discover': 'CreditCard'
    };
    return icons?.[type] || 'CreditCard';
  };

  const validateCard = () => {
    const newErrors = {};
    
    if (!cardData?.cardNumber || cardData?.cardNumber?.replace(/\s/g, '')?.length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!cardData?.expiryDate || !/^\d{2}\/\d{2}$/?.test(cardData?.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date in MM/YY format';
    }
    
    if (!cardData?.cvv || cardData?.cvv?.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!cardData?.cardholderName?.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleAddCard = async () => {
    if (!validateCard()) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSave({ type: 'addCard', cardData });
      setCardData({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
      setIsAddingCard(false);
    } catch (error) {
      setErrors({ general: 'Failed to add card. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCard = async (cardId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave({ type: 'removeCard', cardId });
    } catch (error) {
      console.error('Failed to remove card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetDefault = async (cardId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSave({ type: 'setDefault', cardId });
    } catch (error) {
      console.error('Failed to set default card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletToggle = async (walletId, connect) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onSave({ type: 'toggleWallet', walletId, connect });
    } catch (error) {
      console.error('Failed to toggle wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value?.replace(/\s+/g, '')?.replace(/[^0-9]/gi, '');
    const matches = v?.match(/\d{4,16}/g);
    const match = matches && matches?.[0] || '';
    const parts = [];
    for (let i = 0, len = match?.length; i < len; i += 4) {
      parts?.push(match?.substring(i, i + 4));
    }
    if (parts?.length) {
      return parts?.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value?.replace(/\D/g, '');
    if (v?.length >= 2) {
      return v?.substring(0, 2) + '/' + v?.substring(2, 4);
    }
    return v;
  };

  return (
    <div className={`glass-morphism bg-card/95 rounded-xl border border-border ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Icon name="CreditCard" size={20} className="text-accent" />
            </div>
            <div>
              <h2 className="fluid-text-lg font-semibold text-card-foreground">
                Payment Methods
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your saved cards and digital wallets
              </p>
            </div>
          </div>
          
          {!isAddingCard && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingCard(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Add Card
            </Button>
          )}
        </div>

        <div className="space-y-6">
          {/* Add New Card Form */}
          {isAddingCard && (
            <div className="border border-border rounded-lg p-4 bg-muted/10">
              <h3 className="font-medium text-card-foreground mb-4">Add New Card</h3>
              
              <div className="space-y-4">
                <Input
                  label="Card Number"
                  type="text"
                  value={cardData?.cardNumber}
                  onChange={(e) => setCardData(prev => ({ ...prev, cardNumber: formatCardNumber(e?.target?.value) }))}
                  error={errors?.cardNumber}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    type="text"
                    value={cardData?.expiryDate}
                    onChange={(e) => setCardData(prev => ({ ...prev, expiryDate: formatExpiryDate(e?.target?.value) }))}
                    error={errors?.expiryDate}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                  
                  <Input
                    label="CVV"
                    type="text"
                    value={cardData?.cvv}
                    onChange={(e) => setCardData(prev => ({ ...prev, cvv: e?.target?.value?.replace(/\D/g, '')?.slice(0, 4) }))}
                    error={errors?.cvv}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
                
                <Input
                  label="Cardholder Name"
                  type="text"
                  value={cardData?.cardholderName}
                  onChange={(e) => setCardData(prev => ({ ...prev, cardholderName: e?.target?.value }))}
                  error={errors?.cardholderName}
                  placeholder="Name as on card"
                  required
                />

                {errors?.general && (
                  <div className="p-3 rounded-lg bg-error/10 border border-error/20">
                    <p className="text-sm text-error">{errors?.general}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <Button
                    variant="default"
                    onClick={handleAddCard}
                    loading={isLoading}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Add Card
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingCard(false);
                      setCardData({ cardNumber: '', expiryDate: '', cvv: '', cardholderName: '' });
                      setErrors({});
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Saved Cards */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Saved Cards</h3>
            <div className="space-y-3">
              {savedCards?.map((card) => (
                <div key={card?.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-muted/20">
                        <Icon name={getCardIcon(card?.type)} size={20} className="text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-card-foreground">
                            •••• •••• •••• {card?.lastFour}
                          </h4>
                          {card?.isDefault && (
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {card?.cardholderName} • Expires {card?.expiryDate}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!card?.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(card?.id)}
                          disabled={isLoading}
                        >
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveCard(card?.id)}
                        disabled={isLoading}
                        iconName="Trash2"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Wallets */}
          <div>
            <h3 className="font-medium text-card-foreground mb-4">Digital Wallets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {digitalWallets?.map((wallet) => (
                <div key={wallet?.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        wallet?.connected ? 'bg-success/10' : 'bg-muted/20'
                      }`}>
                        <Icon 
                          name={wallet?.icon} 
                          size={18} 
                          className={wallet?.connected ? 'text-success' : 'text-muted-foreground'} 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-card-foreground text-sm">
                          {wallet?.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {wallet?.connected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant={wallet?.connected ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleWalletToggle(wallet?.id, !wallet?.connected)}
                      loading={isLoading}
                      iconName={wallet?.connected ? "Unlink" : "Link"}
                    >
                      {wallet?.connected ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;