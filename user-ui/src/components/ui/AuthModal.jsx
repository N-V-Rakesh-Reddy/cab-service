import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import ApiService, { ApiError } from '../../utils/api';

const AuthModal = ({ isOpen = false, onClose = () => {}, onSuccess = () => {}, className = '' }) => {
  const [step, setStep] = useState('phone'); // 'phone', 'otp', 'success'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState(''); // Store sessionId from send-otp response
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset form when modal closes
      setStep('phone');
      setPhoneNumber('');
      setOtp('');
      setSessionId('');
      setError('');
      setCountdown(0);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handlePhoneSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!phoneNumber || phoneNumber?.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the real backend API
      const result = await ApiService.sendOtp(phoneNumber);
      
      // Store the sessionId for the verify-otp call
      setSessionId(result.sessionId);
      setStep('otp');
      setCountdown(30);
    } catch (err) {
      console.error('Send OTP error:', err);
      if (err instanceof ApiError) {
        setError(err.message || 'Failed to send OTP. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!otp || otp?.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!sessionId) {
      setError('Session expired. Please request a new OTP.');
      setStep('phone');
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the real backend API
      const result = await ApiService.verifyOtp(phoneNumber, otp, sessionId);
      
      // Store authentication tokens
      if (result.accessToken) {
        localStorage.setItem('auth_token', result.accessToken);
      }
      if (result.refreshToken) {
        localStorage.setItem('refresh_token', result.refreshToken);
      }
      
      setStep('success');
      
      // Auto-close and trigger success after showing success state
      setTimeout(() => {
        onSuccess({
          ...result.user,
          name: result.user.full_name || result.user.mobile_number,
          phone: result.user.mobile_number,
          token: result.accessToken
        });
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Verify OTP error:', err);
      if (err instanceof ApiError) {
        setError(err.message || 'Invalid OTP. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call the real backend API to resend OTP
      const result = await ApiService.sendOtp(phoneNumber);
      
      // Update sessionId for the new OTP
      setSessionId(result.sessionId);
      setCountdown(30);
    } catch (err) {
      console.error('Resend OTP error:', err);
      if (err instanceof ApiError) {
        setError(err.message || 'Failed to resend OTP. Please try again.');
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-300 flex items-center justify-center p-4 glass-morphism bg-black/50 ${className}`}
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-md glass-morphism bg-card/95 rounded-2xl border border-border shadow-modal animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Icon name="Car" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-card-foreground">
                {step === 'phone' && 'Welcome to CabBooker'}
                {step === 'otp' && 'Verify Your Number'}
                {step === 'success' && 'Welcome Aboard!'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {step === 'phone' && 'Enter your phone number to get started'}
                {step === 'otp' && `Code sent to ${phoneNumber}`}
                {step === 'success' && 'Account verified successfully'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-card-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e?.target?.value)}
                error={error}
                required
                className="mb-4"
              />
              
              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isLoading}
                iconName="ArrowRight"
                iconPosition="right"
              >
                Send OTP
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <Input
                label="Verification Code"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e?.target?.value?.replace(/\D/g, '')?.slice(0, 6))}
                error={error}
                required
                className="mb-4 text-center font-mono text-lg tracking-widest"
              />
              
              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isLoading}
                iconName="Check"
                iconPosition="right"
              >
                Verify OTP
              </Button>
              
              <div className="flex items-center justify-between text-sm">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep('phone')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                >
                  Change Number
                </Button>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResendOtp}
                  disabled={countdown > 0 || isLoading}
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </Button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <Icon name="CheckCircle" size={32} color="var(--color-success)" />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                  Verification Successful!
                </h3>
                <p className="text-muted-foreground">
                  Your account has been verified. Redirecting to dashboard...
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="animate-spin">
                  <Icon name="Loader2" size={20} color="var(--color-primary)" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;