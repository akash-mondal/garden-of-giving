import { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, CheckCircle, XCircle, Clock, ExternalLink, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import GardenParticles from '../components/GardenParticles';
import { mockGovernanceProposals } from '../mockData';
import { useToast } from '../hooks/use-toast';

const Governance = () => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'active' | 'passed' | 'failed'>('all');

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const handleVote = (proposalId: number, vote: 'for' | 'against') => {
    toast({
      title: "Vote Submitted!",
      description: `Your vote "${vote}" has been recorded for proposal #${proposalId}`,
    });
    
    console.log(`Voting ${vote} on proposal ${proposalId}`);
  };

  const filteredProposals = mockGovernanceProposals.filter(proposal => {
    if (filter === 'all') return true;
    return proposal.status === filter;
  });

  const totalVotingPower = 250; // Mock staked HEART tokens = voting power

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
            <Vote className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-shadows text-foreground">
              Governance
            </h1>
          </div>
          <p className="text-xl font-caveat text-primary">
            Shape the future of our platform, {user.name}
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card-garden p-6 text-center">
            <Vote className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              {totalVotingPower}
            </div>
            <div className="text-sm text-muted-foreground">
              Voting Power
            </div>
          </div>
          
          <div className="card-garden p-6 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              {mockGovernanceProposals.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Proposals
            </div>
          </div>

          <div className="card-garden p-6 text-center">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              {mockGovernanceProposals.filter(p => p.status === 'passed').length}
            </div>
            <div className="text-sm text-muted-foreground">
              Passed
            </div>
          </div>

          <div className="card-garden p-6 text-center">
            <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="text-2xl font-nunito font-bold text-foreground mb-1">
              {mockGovernanceProposals.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">
              Active
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {[
            { id: 'all', label: 'All Proposals' },
            { id: 'active', label: 'Active' },
            { id: 'passed', label: 'Passed' },
            { id: 'failed', label: 'Failed' }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id as any)}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                filter === id
                  ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--vibrant-rose)/0.4)]'
                  : 'bg-card text-foreground hover:bg-primary/10'
              }`}
            >
              <span className="font-nunito font-medium">{label}</span>
            </button>
          ))}
        </motion.div>

        {/* Proposals List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {filteredProposals.map((proposal, index) => (
            <motion.div
              key={proposal.proposalId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="card-garden p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-nunito font-bold text-foreground mb-2">
                    #{proposal.proposalId}: {proposal.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {proposal.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-4">
                    <span>By {proposal.proposer}</span>
                    <span className={`px-3 py-1 rounded-full ${
                      proposal.status === 'active' 
                        ? 'bg-primary/20 text-primary' 
                        : proposal.status === 'passed'
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-red-500/20 text-red-600'
                    }`}>
                      {proposal.status.toUpperCase()}
                    </span>
                    {proposal.endTimestamp && (
                      <span>Ends {new Date(proposal.endTimestamp).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Vote Results */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>For: {proposal.votesFor.toLocaleString()}</span>
                  </span>
                  <span className="text-red-600 flex items-center space-x-1">
                    <XCircle className="w-4 h-4" />
                    <span>Against: {proposal.votesAgainst.toLocaleString()}</span>
                  </span>
                </div>
                
                <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ 
                      width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%` 
                    }}
                  />
                </div>

                {/* Voting Buttons */}
                {proposal.status === 'active' && (
                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={() => handleVote(proposal.proposalId, 'for')}
                      className="flex-1 btn-garden-primary flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Vote For</span>
                    </button>
                    <button
                      onClick={() => handleVote(proposal.proposalId, 'against')}
                      className="flex-1 btn-garden-secondary flex items-center justify-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Vote Against</span>
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProposals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🗳️</div>
            <h3 className="text-2xl font-nunito font-bold text-foreground mb-2">
              No Proposals Found
            </h3>
            <p className="text-muted-foreground">
              No proposals match the current filter. Try selecting a different filter.
            </p>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <div className="card-garden p-6 bg-primary/5 border-primary/20">
            <h4 className="text-lg font-nunito font-semibold text-foreground mb-4">
              How Governance Works
            </h4>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p>• <strong>Voting Power:</strong> 1 staked HEART token = 1 vote</p>
                <p>• <strong>Quorum:</strong> Minimum 10% of total staked tokens must vote</p>
                <p>• <strong>Threshold:</strong> 60% majority required to pass</p>
              </div>
              <div className="space-y-2">
                <p>• <strong>Voting Period:</strong> 7 days for most proposals</p>
                <p>• <strong>Execution:</strong> Passed proposals execute after 2-day delay</p>
                <p>• <strong>Participation:</strong> Higher staking = stronger voice</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Governance;