import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid3X3, List } from 'lucide-react';
import CharityEventCard from '../components/CharityEventCard';
import GardenParticles from '../components/GardenParticles';
import { mockCharityEvents } from '../mockData';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-shadows text-foreground mb-4">
            The Garden of Causes
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover meaningful campaigns and earn HEART tokens. Transform your compassion into Heart NFTs 
            that celebrate your generosity.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-garden p-6 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search causes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort */}
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="progress">Most Funded</option>
                  <option value="recent">Recently Added</option>
                  <option value="ending">Ending Soon</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center bg-background border border-border rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-muted-foreground">
            Found <span className="font-nunito font-semibold text-foreground">{filteredEvents.length}</span> campaigns
            {searchTerm && (
              <span> matching "<span className="text-primary">{searchTerm}</span>"</span>
            )}
          </p>
        </motion.div>

        {/* Campaigns Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.eventAddress}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CharityEventCard event={event} />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-nunito font-bold text-foreground mb-2">
              No campaigns found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or browse all available campaigns.
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="btn-garden-primary"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Load More (Future Enhancement) */}
        {filteredEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-12"
          >
            <button className="btn-garden-secondary">
              Load More Campaigns
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;