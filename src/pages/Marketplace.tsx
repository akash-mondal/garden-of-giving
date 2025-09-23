import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import GSAPMarketplace from '../components/GSAPMarketplace';
import GardenParticles from '../components/GardenParticles';
import { mockCharityEvents } from '../mockData';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'progress' | 'recent' | 'ending'>('progress');

  const filteredEvents = mockCharityEvents
    .filter(event => 
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.charityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'progress':
          return (b.totalDonated / b.goalAmount) - (a.totalDonated / a.goalAmount);
        case 'recent':
          return b.endTimestamp - a.endTimestamp;
        case 'ending':
          return a.endTimestamp - b.endTimestamp;
        default:
          return 0;
      }
    });

  return (
    <div className="relative min-h-screen py-8">
      <GardenParticles />
      
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl lg:text-7xl font-shadows text-foreground mb-6">
            The Garden of Causes
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Discover meaningful campaigns and earn HEART tokens. Transform your compassion into Heart NFTs 
            that celebrate your generosity. Hover over campaigns to see their impact.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-garden p-8 mb-12"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search causes that inspire you..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-lg"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-background border border-border rounded-full px-6 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                <option value="progress">Most Funded</option>
                <option value="recent">Recently Added</option>
                <option value="ending">Ending Soon</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-lg text-muted-foreground text-center">
            Found <span className="font-nunito font-bold text-foreground text-xl">{filteredEvents.length}</span> campaigns
            {searchTerm && (
              <span> matching "<span className="text-primary font-semibold">{searchTerm}</span>"</span>
            )}
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2 font-caveat">
            Hover over campaigns to preview their impact
          </p>
        </motion.div>

        {/* GSAP Marketplace */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GSAPMarketplace events={filteredEvents} />
        </motion.div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-3xl font-shadows text-foreground mb-4">
              No campaigns found
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Try adjusting your search terms or browse all available campaigns to find causes that inspire you.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="btn-garden-primary !text-lg !px-8 !py-4"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;