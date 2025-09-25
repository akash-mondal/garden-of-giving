import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Target, Heart, Clock, ArrowLeft, Share, Sparkles } from 'lucide-react';
import { CharityEvent, Donation } from '../types';
import { getEventByAddress, calculateProgress, formatAPT, getTimeRemaining, mockRecentDonations } from '../mockData';
import DonationModal from '../components/DonationModal';
import GardenParticles from '../components/GardenParticles';

const EventDetail = () => {
  const { eventAddress } = useParams<{ eventAddress: string }>();
  const [event, setEvent] = useState<CharityEvent | null>(null);
  const [donationModalOpen, setDonationModalOpen] = useState(false);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [stickyDonation, setStickyDonation] = useState(false);

  useEffect(() => {
    if (eventAddress) {
      const foundEvent = getEventByAddress(eventAddress);
      setEvent(foundEvent || null);
      
      // Filter donations for this event
      const eventDonations = mockRecentDonations.filter(
        donation => donation.eventAddress === eventAddress
      );
      setRecentDonations(eventDonations);
    }
  }, [eventAddress]);

  useEffect(() => {
    const handleScroll = () => {
      setStickyDonation(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-nunito font-bold text-foreground mb-2">
            Campaign Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The campaign you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/marketplace" className="btn-garden-primary">
            Browse Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const progress = calculateProgress(event.totalDonated, event.goalAmount);
  const timeRemaining = getTimeRemaining(event.endTimestamp);

  const handleDonationSuccess = (amount: number, heartTokens: number) => {
    // Update the event's total donated amount
    setEvent(prev => prev ? {
      ...prev,
      totalDonated: prev.totalDonated + amount
    } : null);

    // Add a new recent donation
    const newDonation: Donation = {
      id: Date.now().toString(),
      donorName: 'You',
      amount,
      eventAddress: event.eventAddress,
      timestamp: Date.now()
    };
    setRecentDonations(prev => [newDonation, ...prev]);
  };

  return (
    <div className="relative min-h-screen">
      <GardenParticles />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link 
            to="/marketplace"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Marketplace</span>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-3xl overflow-hidden"
            >
              <img
                src={event.imageUrl}
                alt={event.eventName}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Share Button */}
              <button className="absolute top-4 right-4 p-3 bg-background/90 backdrop-blur-sm rounded-full text-foreground hover:bg-background transition-colors">
                <Share className="w-5 h-5" />
              </button>

              {/* Campaign Info Overlay */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-primary rounded-full text-sm font-nunito font-medium">
                    {event.charityName}
                  </span>
                  <div className="flex items-center space-x-1 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{timeRemaining}</span>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-nunito font-bold mb-2">
                  {event.eventName}
                </h1>
              </div>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-garden p-6"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-nunito font-bold text-primary">
                    {Math.round(progress)}% funded
                  </span>
                  <span className="text-lg text-muted-foreground">
                    {formatAPT(event.totalDonated)} / {formatAPT(event.goalAmount)} APT
                  </span>
                </div>
                
                {/* Custom Progress Bar */}
                <div className="progress-vine">
                  <motion.div
                    className="progress-vine-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-nunito font-bold text-foreground">
                      {Math.floor(event.totalDonated / 50)}
                    </div>
                    <div className="text-sm text-muted-foreground">Donors</div>
                  </div>
                  <div>
                    <div className="text-2xl font-nunito font-bold text-foreground">
                      {event.milestones.filter(m => m.isClaimed).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Milestones</div>
                  </div>
                  <div>
                    <div className="text-2xl font-nunito font-bold text-foreground">
                      {timeRemaining.includes('day') ? timeRemaining.split(' ')[0] : '< 1'}
                    </div>
                    <div className="text-sm text-muted-foreground">Days Left</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-garden p-6"
            >
              <h2 className="text-2xl font-nunito font-bold text-foreground mb-4">
                About This Campaign
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {event.description}
              </p>
            </motion.div>

            {/* Milestones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-garden p-6"
            >
              <h2 className="text-2xl font-nunito font-bold text-foreground mb-6">
                Funding Milestones
              </h2>
              
              <div className="space-y-4">
                {event.milestones.map((milestone, index) => {
                  const isReached = event.totalDonated >= milestone.goalAmount;
                  const isClaimed = milestone.isClaimed;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all ${
                        isClaimed 
                          ? 'border-mint-soft bg-mint-soft/20' 
                          : isReached 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border bg-background'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isClaimed 
                          ? 'bg-mint-soft text-green-600' 
                          : isReached 
                          ? 'bg-primary text-primary-foreground glow-pulse' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {isClaimed ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bloom"
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <Target className="w-5 h-5" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-nunito font-semibold">
                            {formatAPT(milestone.goalAmount)} APT Goal
                          </span>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4 text-primary" fill="currentColor" />
                            <span className="font-caveat text-lg font-semibold text-primary">
                              +{milestone.bonusReward} HEART bonus
                            </span>
                          </div>
                        </div>
                        
                        {isClaimed && (
                          <p className="text-sm text-green-600 mt-1">
                            ✨ Milestone achieved! Bonus rewards distributed.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donation Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={`card-garden p-6 ${stickyDonation ? 'lg:sticky lg:top-8' : ''}`}
            >
              <h3 className="text-xl font-nunito font-bold text-foreground mb-4">
                Make Your Impact
              </h3>
              
              <motion.button
                onClick={() => setDonationModalOpen(true)}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 20px 40px -10px hsl(var(--primary) / 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-4 mb-4 transition-all duration-300 hover:from-primary/90 hover:via-primary hover:to-primary/90"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="relative flex items-center justify-center space-x-2 text-primary-foreground font-nunito font-bold text-lg">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Heart className="w-6 h-6" fill="currentColor" />
                  </motion.div>
                  <span>Donate Now</span>
                  <motion.div
                    animate={{ 
                      opacity: [0.5, 1, 0.5],
                      scale: [1, 1.1, 1] 
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-yellow-300"
                  >
                    ✨
                  </motion.div>
                </div>
              </motion.button>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Every donation earns HEART tokens
                </p>
                <div className="flex items-center justify-center space-x-1">
                  <span className="text-xs text-muted-foreground">1 APT =</span>
                  <Heart className="w-3 h-3 text-primary" fill="currentColor" />
                  <span className="text-sm font-nunito font-semibold text-primary">
                    2 HEART
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Recent Donations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card-garden p-6"
            >
              <h3 className="text-lg font-nunito font-bold text-foreground mb-4">
                Recent Donations
              </h3>
              
              <div className="space-y-3">
                <AnimatePresence>
                  {recentDonations.slice(0, 5).map((donation) => (
                    <motion.div
                      key={donation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-between items-center p-3 bg-background rounded-xl"
                    >
                      <div>
                        <p className="font-caveat text-lg font-semibold text-primary">
                          {donation.donorName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(donation.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-nunito font-semibold">
                          {formatAPT(donation.amount)} APT
                        </p>
                        <p className="text-xs text-primary">
                          planted a seed 🌱
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {recentDonations.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-4">
                    Be the first to support this cause!
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Donation Modal */}
      <DonationModal
        isOpen={donationModalOpen}
        onClose={() => setDonationModalOpen(false)}
        event={event}
        onSuccess={handleDonationSuccess}
      />
    </div>
  );
};

export default EventDetail;