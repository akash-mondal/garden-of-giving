import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Loader2, CheckCircle, Sparkles } from 'lucide-react';
import { CharityEvent } from '../types';
import { formatAPT } from '../mockData';

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
            initial={{ 
              opacity: 0, 
              scale: 0.7, 
              y: 50,
              rotateX: 20,
              rotateY: 10
            }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              rotateX: 0,
              rotateY: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 30,
              rotateX: -10
            }}
            transition={{ 
              type: "spring", 
              damping: 20, 
              stiffness: 280,
              duration: 0.6
            }}
            className="relative w-full max-w-md bg-card rounded-3xl shadow-[var(--shadow-garden)] border border-border overflow-hidden backdrop-blur-sm"
            style={{ transformStyle: "preserve-3d" }}
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
                  initial={{ 
                    opacity: 0, 
                    x: 30,
                    filter: "blur(10px)"
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    filter: "blur(0px)"
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -30,
                    filter: "blur(5px)"
                  }}
                  transition={{ 
                    duration: 0.4,
                    ease: "easeOut"
                  }}
                  className="p-6 space-y-6"
                >
                  <motion.div 
                    className="text-center"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.h2 
                      className="text-2xl font-shadows text-foreground mb-2"
                      animate={{ 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      style={{
                        background: "linear-gradient(45deg, hsl(var(--foreground)), hsl(var(--primary)), hsl(var(--foreground)))",
                        backgroundSize: "200% 200%",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                      }}
                    >
                      Plant a Seed of Hope
                    </motion.h2>
                    <motion.p 
                      className="text-sm text-muted-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      for {event.eventName}
                    </motion.p>
                  </motion.div>

                  {/* Quick Amount Buttons */}
                  <motion.div 
                    className="grid grid-cols-3 gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, staggerChildren: 0.1 }}
                  >
                    {quickAmounts.map((value, index) => (
                      <motion.button
                        key={value}
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          delay: 0.4 + index * 0.05,
                          type: "spring",
                          stiffness: 300,
                          damping: 20
                        }}
                        whileHover={{ 
                          scale: 1.05,
                          y: -2,
                          boxShadow: "0 8px 25px -8px hsl(var(--primary) / 0.3)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAmountSelect(value)}
                        className={`group relative p-3 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                          amount === value.toString()
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50 hover:bg-primary/5'
                        }`}
                      >
                        {amount === value.toString() && (
                          <motion.div
                            layoutId="selected-amount"
                            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
                            initial={false}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <div className="relative font-nunito font-semibold">{value} APT</div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                          animate={amount === value.toString() ? { translateX: ["100%", "-100%"] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </motion.button>
                    ))}
                  </motion.div>

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
                  initial={{ 
                    opacity: 0, 
                    x: 40,
                    rotateY: 20,
                    filter: "blur(10px)"
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    rotateY: 0,
                    filter: "blur(0px)"
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -40,
                    rotateY: -20,
                    filter: "blur(5px)"
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeOut"
                  }}
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
                  initial={{ 
                    opacity: 0, 
                    scale: 0.5,
                    rotate: -180,
                    filter: "blur(20px)"
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    rotate: 0,
                    filter: "blur(0px)"
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.7,
                    rotate: 180,
                    filter: "blur(10px)"
                  }}
                  transition={{ 
                    duration: 0.7,
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="p-6 text-center space-y-6"
                >
                  <div className="h-32 relative flex items-center justify-center">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.3, 0.9, 1.2, 1],
                        rotate: [0, 180, 360, 540, 720],
                        y: [0, -10, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="text-6xl"
                    >
                      🌱
                    </motion.div>
                    {/* Floating particles around the seed */}
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-2xl"
                        animate={{
                          x: [0, Math.cos(i * 60 * Math.PI / 180) * 40],
                          y: [0, Math.sin(i * 60 * Math.PI / 180) * 40],
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeInOut"
                        }}
                      >
                        ✨
                      </motion.div>
                    ))}
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
                  initial={{ 
                    opacity: 0, 
                    scale: 0.3,
                    y: 100,
                    rotateX: -90,
                    filter: "blur(20px)"
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: 0,
                    rotateX: 0,
                    filter: "blur(0px)"
                  }}
                  exit={{ 
                    opacity: 0, 
                    scale: 0.5,
                    y: -50,
                    rotateX: 90,
                    filter: "blur(10px)"
                  }}
                  transition={{ 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 150,
                    damping: 12
                  }}
                  className="p-6 text-center space-y-6"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ 
                      scale: [0, 1.2, 0.9, 1.1, 1],
                      rotate: [-180, 0, 10, -5, 0]
                    }}
                    transition={{ 
                      type: "spring", 
                      delay: 0.3,
                      duration: 1.2,
                      stiffness: 200,
                      damping: 10
                    }}
                    className="relative w-20 h-20 bg-mint-soft rounded-full flex items-center justify-center mx-auto"
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 360]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>
                    {/* Success particles */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute text-lg"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                          y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 0.5 + i * 0.1,
                          ease: "easeOut"
                        }}
                      >
                        🎉
                      </motion.div>
                    ))}
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