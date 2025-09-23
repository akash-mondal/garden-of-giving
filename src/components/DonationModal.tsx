import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { CharityEvent } from '../types';
import { formatAPT } from '../mockData';
import InteractiveGarden from './InteractiveGarden';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CharityEvent | null;
  onSuccess?: (amount: number, heartTokens: number) => void;
}

type DonationStep = 'amount' | 'confirmation' | 'processing' | 'success';

const DonationModal: React.FC<DonationModalProps> = ({ 
  isOpen, 
  onClose, 
  event,
  onSuccess 
}) => {
  const [step, setStep] = useState<DonationStep>('amount');
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [estimatedReward, setEstimatedReward] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>('');

  // Quick select amounts
  const quickAmounts = [10, 25, 50, 100, 250];

  // Calculate HEART token reward (1 APT = 2 HEART tokens base rate)
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    setEstimatedReward(Math.floor(numAmount * 2));
  }, [amount]);

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setAmount(value);
  };

  const handleNext = () => {
    if (step === 'amount' && parseFloat(amount) > 0) {
      setStep('confirmation');
    }
  };

  const handleConfirm = async () => {
    setStep('processing');
    
    // Stage 1: Preparing transaction
    setProcessingStage('Preparing your transaction...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Stage 2: Network confirmation
    setProcessingStage('Awaiting confirmation on the Aptos network...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Success
    setStep('success');
    onSuccess?.(parseFloat(amount), estimatedReward);
  };

  const handleClose = () => {
    onClose();
    // Reset after animation completes
    setTimeout(() => {
      setStep('amount');
      setAmount('');
      setCustomAmount('');
      setEstimatedReward(0);
      setProcessingStage('');
    }, 300);
  };

  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-card rounded-3xl shadow-[var(--shadow-garden)] border border-border overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Step 1: Amount Selection */}
            <AnimatePresence mode="wait">
              {step === 'amount' && (
                <motion.div
                  key="amount"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-shadows text-foreground mb-2">
                      Plant a Seed of Hope
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      for {event.eventName}
                    </p>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map((value) => (
                      <button
                        key={value}
                        onClick={() => handleAmountSelect(value)}
                        className={`p-3 rounded-2xl border-2 transition-all ${
                          amount === value.toString()
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="font-nunito font-semibold">{value} APT</div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-2">
                    <label className="block text-sm font-nunito font-medium text-foreground">
                      Custom Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        placeholder="0.00"
                        value={customAmount}
                        onChange={(e) => handleCustomAmountChange(e.target.value)}
                        className="w-full p-4 bg-background border border-border rounded-2xl text-center text-xl font-nunito font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        APT
                      </span>
                    </div>
                  </div>

                  {/* Reward Estimate */}
                  {estimatedReward > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-primary/5 rounded-2xl border border-primary/20"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">You'll receive:</span>
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                          <span className="font-caveat text-lg font-semibold text-primary">
                            {estimatedReward} HEART tokens
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <button
                    onClick={handleNext}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className="w-full btn-garden-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </motion.div>
              )}

              {/* Step 2: Confirmation */}
              {step === 'confirmation' && (
                <motion.div
                  key="confirmation"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-shadows text-foreground mb-2">
                      Confirm Your Donation
                    </h2>
                  </div>

                  <div className="card-garden p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Campaign:</span>
                      <span className="font-nunito font-semibold text-right max-w-48 truncate">
                        {event.eventName}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-nunito font-bold text-xl text-primary">
                        {formatAPT(parseFloat(amount))} APT
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">HEART Reward:</span>
                      <span className="font-caveat text-lg font-semibold text-primary">
                        {estimatedReward} ❤️
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-mint-soft/20 rounded-2xl border border-mint-soft/50">
                    <p className="text-sm text-center font-caveat text-lg">
                      "You are about to plant a seed of {formatAPT(parseFloat(amount))} APT for the {event.eventName} campaign."
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setStep('amount')}
                      className="flex-1 btn-garden-secondary"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirm}
                      className="flex-1 btn-garden-primary"
                    >
                      Confirm Donation
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Processing */}
              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-6 text-center space-y-6"
                >
                  <div className="h-32 relative flex items-center justify-center">
                    <InteractiveGarden donationCount={1} totalDonated={parseFloat(amount)} />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      <span className="font-nunito font-medium text-foreground">
                        Processing...
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground text-sm">
                      {processingStage}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-6 text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-20 h-20 bg-mint-soft rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </motion.div>

                  <div className="space-y-2">
                    <h2 className="text-3xl font-shadows text-primary">
                      Thank You!
                    </h2>
                    <p className="text-muted-foreground">
                      Your donation has been successfully recorded.
                    </p>
                  </div>

                  <div className="card-garden p-4 space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-nunito font-semibold">
                        You've earned {estimatedReward} HEART tokens!
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your digital garden is growing beautifully
                    </p>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full btn-garden-primary"
                  >
                    Continue Growing
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DonationModal;