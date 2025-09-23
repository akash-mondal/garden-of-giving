import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, Sparkles, Heart, Leaf } from 'lucide-react';
import Garden3D from '../components/Garden3D';
import CharityEventCard from '../components/CharityEventCard';
import GardenParticles from '../components/GardenParticles';
import { mockCharityEvents } from '../mockData';

const Landing = () => {
  const featuredEvents = mockCharityEvents.slice(0, 3);

  const scrollToMarketplace = () => {
    document.getElementById('featured-campaigns')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="relative min-h-screen">
      <GardenParticles />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4 z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center lg:text-left space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center lg:justify-start space-x-2"
                >
                  <Sparkles className="w-6 h-6 text-primary" />
                  <span className="text-primary font-nunito font-semibold">
                    Web3 Charitable Platform
                  </span>
                </motion.div>

                <h1 className="text-6xl lg:text-7xl font-shadows text-foreground leading-tight">
                  Every Donation is a{' '}
                  <span className="text-garden-glow">Seed of Hope</span>
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl">
                  Nurture a digital garden of giving and earn rewards for your compassion 
                  on the Aptos blockchain. Watch your impact grow with every donation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
                <motion.button
                  onClick={scrollToMarketplace}
                  className="btn-garden-primary group flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Leaf className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Start Planting</span>
                </motion.button>

                <Link 
                  to="/marketplace"
                  className="btn-garden-secondary flex items-center space-x-2"
                >
                  <Heart className="w-5 h-5" />
                  <span>Explore Causes</span>
                </Link>
              </div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-3 gap-8 pt-8"
              >
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-nunito font-bold text-primary">
                    2.8M
                  </div>
                  <div className="text-sm text-muted-foreground">
                    APT Donated
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-nunito font-bold text-primary">
                    15K+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Gardens Planted
                  </div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-nunito font-bold text-primary">
                    42
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Active Causes
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Side - 3D Garden */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-96 lg:h-[500px]"
            >
              <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full blur-3xl" />
              <Garden3D 
                donationCount={8} 
                totalDonated={2847} 
                className="relative z-10"
              />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollToMarketplace}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-primary hover:text-primary/80 transition-colors"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6" />
        </motion.button>
      </section>

      {/* Featured Campaigns Section */}
      <section id="featured-campaigns" className="py-20 bg-gradient-to-b from-transparent to-background/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-5xl font-shadows text-foreground mb-4">
              Choose Where to Plant
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover meaningful causes that are making a real difference in the world. 
              Every donation helps these digital gardens flourish.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.map((event, index) => (
              <motion.div
                key={event.eventAddress}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <CharityEventCard event={event} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link 
              to="/marketplace"
              className="btn-garden-primary inline-flex items-center space-x-2"
            >
              <span>View All Campaigns</span>
              <ArrowDown className="w-4 h-4 rotate-[-90deg]" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-background/50 to-card/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-shadows text-foreground mb-4">
              How Your Garden Grows
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every action you take in CharityRewards helps both the causes you care about 
              and your own digital garden flourish.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Plant Seeds",
                description: "Make donations to causes you care about and watch your impact grow in real-time."
              },
              {
                icon: Sparkles,
                title: "Earn Rewards",
                description: "Receive HEART tokens for every donation and unlock special milestone bonuses."
              },
              {
                icon: Leaf,
                title: "Watch Growth",
                description: "Your digital garden evolves based on your giving, creating a beautiful testament to your generosity."
              }
            ].map(({ icon: Icon, title, description }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card-garden p-8 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-nunito font-bold text-foreground">
                  {title}
                </h3>
                <p className="text-muted-foreground">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;