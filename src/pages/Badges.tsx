import { motion } from 'framer-motion';
import { Award, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import GardenParticles from '../components/GardenParticles';

const Badges = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Mock badges data
  const mockBadges = [
    {
      tokenId: '1',
      name: 'First Donor',
      description: 'Made your first donation',
      imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=badge1',
      dateEarned: '2024-03-01'
    },
    {
      tokenId: '2', 
      name: 'Ocean Protector',
      description: 'Donated to marine conservation',
      imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=badge2',
      dateEarned: '2024-03-10'
    },
    {
      tokenId: '3',
      name: 'Forest Guardian',
      description: 'Supported reforestation efforts',
      imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=badge3', 
      dateEarned: '2024-03-15'
    },
    {
      tokenId: '4',
      name: 'Community Builder',
      description: 'Referred 5 new donors',
      imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=badge4',
      dateEarned: '2024-03-20'
    },
    {
      tokenId: '5',
      name: 'Generous Heart',
      description: 'Donated over $1000 total',
      imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=badge5',
      dateEarned: '2024-03-25'
    },
    {
      tokenId: '6',
      name: 'Consistency Champion',
      description: 'Made donations 3 months in a row',
      imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=badge6',
      dateEarned: '2024-03-30'
    }
  ];

  return (
    <div className="relative min-h-screen py-8">
      <GardenParticles />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Award className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-shadows text-foreground">
              My Badges
            </h1>
          </div>
          <p className="text-xl font-caveat text-primary">
            Your achievement collection, {user.name}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="card-garden p-6 text-center">
            <Award className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              {mockBadges.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Badges
            </div>
          </div>
          
          <div className="card-garden p-6 text-center">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              {new Date(mockBadges[mockBadges.length - 1].dateEarned).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })}
            </div>
            <div className="text-sm text-muted-foreground">
              Latest Badge
            </div>
          </div>

          <div className="card-garden p-6 text-center">
            <div className="text-4xl mb-3">🏆</div>
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              Rare
            </div>
            <div className="text-sm text-muted-foreground">
              Rarest Badge
            </div>
          </div>
        </motion.div>

        {/* Badges Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mockBadges.map((badge, index) => (
            <motion.div
              key={badge.tokenId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="card-garden p-6 text-center space-y-4"
            >
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden">
                <img
                  src={badge.imageUrl}
                  alt={badge.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-nunito font-bold text-foreground mb-1">
                  {badge.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {badge.description}
                </p>
                <p className="text-xs text-primary font-caveat">
                  Earned {new Date(badge.dateEarned).toLocaleDateString()}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="card-garden p-8 bg-primary/5 border-primary/20">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-nunito font-bold text-foreground mb-2">
              More Badges Coming Soon!
            </h3>
            <p className="text-muted-foreground">
              Keep donating and engaging with the community to unlock new achievement badges.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Badges;