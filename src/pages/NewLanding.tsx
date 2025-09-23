import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/all';
import { useWallet } from '../contexts/WalletContext';
import gardenBackground from '../assets/garden-background.jpg';
import '../styles/newLanding.css';

// Register GSAP plugins
gsap.registerPlugin(ScrambleTextPlugin);

const NewLanding = () => {
  const { connect, isConnected } = useWallet();
  const preloaderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user has already seen the animation
    const hasSeenAnimation = localStorage.getItem('hasSeenGardenAnimation');
    
    // Create custom ease for animations
    const slideEase = "cubic-bezier(0.65,0.05,0.36,1)";

    // Initialize elements
    const terminalLines = document.querySelectorAll(".terminal-line");
    const preloaderEl = preloaderRef.current;
    const contentEl = contentRef.current;

    // Special characters for scramble effect
    const specialChars = "▪";

    // Store original text content for spans that will be scrambled
    const originalTexts: { [key: number]: string } = {};
    document
      .querySelectorAll('.terminal-line span[data-scramble="true"]')
      .forEach(function (span, index) {
        if (span && span.textContent) {
          const originalText = span.textContent;
          originalTexts[index] = originalText;
          (span as HTMLElement).setAttribute("data-original-text", originalText);
          (span as HTMLElement).textContent = "";
        }
      });

    // Set initial state - make sure terminal lines are initially hidden
    gsap.set(".terminal-line", {
      opacity: 0
    });

    // Function to update progress bar
    function updateProgress(percent: number) {
      const progressBar = document.getElementById("progress-bar");
      if (progressBar) {
        progressBar.style.transition = "none";
        progressBar.style.width = percent + "%";
      }
    }

    // Terminal preloader animation
    function animateTerminalPreloader() {
      // Reset progress to 0%
      updateProgress(0);

      // Create main timeline for text animation
      const tl = gsap.timeline({
        onComplete: function () {
          // Once preloader is done, reveal the content
          revealContent();
        }
      });

      // Total animation duration in seconds
      const totalDuration = 6;

      // Get all terminal lines and sort them by top position
      const allLines = Array.from(document.querySelectorAll(".terminal-line"));
      allLines.sort((a, b) => {
        const aTop = parseInt((a as HTMLElement).style.top);
        const bTop = parseInt((b as HTMLElement).style.top);
        return aTop - bTop;
      });

      // Create a timeline for text reveal that's synced with progress
      const textRevealTl = gsap.timeline();

      // Process each line for text reveal
      allLines.forEach((line, lineIndex) => {
        // Set base opacity - alternating between full and reduced opacity
        const baseOpacity = lineIndex % 2 === 0 ? 1 : 0.7;

        // Calculate when this line should appear based on total duration
        // Distribute evenly across the first 80% of the animation
        const timePoint = (lineIndex / allLines.length) * (totalDuration * 0.8);

        // Reveal the line
        textRevealTl.to(
          line,
          {
            opacity: baseOpacity,
            duration: 0.3
          },
          timePoint
        );

        // Get all spans in this line that should be scrambled
        const scrambleSpans = line.querySelectorAll('span[data-scramble="true"]');

        // Apply scramble effect to each span
        scrambleSpans.forEach((span) => {
          if (span && span.getAttribute) {
            const originalText =
              span.getAttribute("data-original-text") || span.textContent || '';

            if (originalText) {
              // Add scramble effect slightly after the line appears
              textRevealTl.to(
                span,
                {
                  duration: 0.8,
                  scrambleText: {
                    text: originalText,
                    chars: specialChars,
                    revealDelay: 0,
                    speed: 0.3
                  },
                  ease: "none"
                },
                timePoint + 0.1
              );
            }
          }
        });
      });

      // Add the text reveal timeline to the main timeline
      tl.add(textRevealTl, 0);

      // Add periodic scramble effects throughout the animation
      for (let i = 0; i < 3; i++) {
        const randomTime = 1 + i * 1.5; // Spread out the glitch effects
        tl.add(function () {
          const glitchTl = gsap.timeline();

          // Select random elements to glitch
          const allScrambleSpans = document.querySelectorAll(
            'span[data-scramble="true"]'
          );
          
          // Only proceed if we have scramble spans available
          if (allScrambleSpans.length === 0) {
            return glitchTl;
          }
          
          const randomSpans: HTMLElement[] = [];

          // Select 3-5 random spans to glitch
          const numToGlitch = 3 + Math.floor(Math.random() * 3);
          for (let j = 0; j < numToGlitch; j++) {
            const randomIndex = Math.floor(
              Math.random() * allScrambleSpans.length
            );
            const selectedSpan = allScrambleSpans[randomIndex] as HTMLElement;
            if (selectedSpan) {
              randomSpans.push(selectedSpan);
            }
          }

          // Apply glitch effect to selected spans
          randomSpans.forEach((span) => {
            if (span && (span.textContent || span.getAttribute("data-original-text"))) {
              const text =
                span.textContent || span.getAttribute("data-original-text") || '';

              // Quick scramble for glitch effect
              glitchTl.to(
                span,
                {
                  duration: 0.2,
                  scrambleText: {
                    text: text,
                    chars: specialChars,
                    revealDelay: 0,
                    speed: 0.1
                  },
                  ease: "none",
                  repeat: 1
                },
                Math.random() * 0.5
              );
            }
          });

          return glitchTl;
        }, randomTime);
      }

      // Add staggered disappearing effect at the end
      const disappearTl = gsap.timeline();

      // Add staggered disappear effect for each line
      disappearTl.to(allLines, {
        opacity: 0,
        duration: 0.2,
        stagger: 0.1, // 0.1 second between each line disappearing
        ease: "power1.in"
      });

      // Add the disappear timeline near the end of the main timeline
      tl.add(disappearTl, totalDuration - 1);

      // Set up progress bar animation that's synced with the main timeline
      tl.eventCallback("onUpdate", function () {
        const progress = Math.min(99, tl.progress() * 100);
        updateProgress(progress);
      });

      // Force final update to 100% at the end
      tl.call(
        function () {
          updateProgress(100);
        },
        [],
        totalDuration - 0.5
      );

      return tl;
    }

    // Reveal content by transitioning the preloader out
    function revealContent() {
      const titleLines = document.querySelectorAll(
        ".quote-section .title-line span"
      );

      // Create timeline for content reveal
      const revealTl = gsap.timeline();

      // Clip the preloader from bottom to top (similar to menu animation)
      revealTl.to(preloaderEl, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 0.64,
        ease: slideEase,
        onComplete: () => {
          // Remove preloader after animation
          if (preloaderEl) preloaderEl.style.display = "none";
        }
      });

      // Show the content
      revealTl.to(
        contentEl,
        {
          opacity: 1,
          visibility: "visible",
          duration: 0.3
        },
        "-=0.3"
      );

      // Animate the title lines
      revealTl.to(
        titleLines,
        {
          y: "0%",
          duration: 0.64,
          stagger: 0.1,
          ease: slideEase
        },
        "-=0.2"
      );
    }

    // Setup initial preloader state
    if (preloaderEl) {
      gsap.set(preloaderEl, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"
      });
    }

    // Set initial state for title lines
    const titleLines = document.querySelectorAll(
      ".quote-section .title-line span"
    );
    gsap.set(titleLines, {
      y: "100%"
    });

    // Skip animation if user has seen it before
    if (hasSeenAnimation) {
      // Hide preloader immediately
      if (preloaderEl) {
        preloaderEl.style.display = "none";
      }
      
      // Show content immediately
      if (contentEl) {
        gsap.set(contentEl, {
          opacity: 1,
          visibility: "visible"
        });
      }

      // Show title lines immediately
      gsap.set(titleLines, {
        y: "0%"
      });
    } else {
      // First time visitor - show full animation
      const terminalAnimation = animateTerminalPreloader();
      
      // Mark as seen
      localStorage.setItem('hasSeenGardenAnimation', 'true');

      return () => {
        // Cleanup
        terminalAnimation.kill();
      };
    }
  }, []);

  return (
    <div className="new-landing">
      <div className="background-image" style={{ backgroundImage: `url(${gardenBackground})` }}></div>
      
      {/* Simple Navigation */}
      <nav className="simple-nav">
        <div className="nav-brand">
          <Link to="/">CharityRewards</Link>
        </div>
        <div className="nav-links">
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={isConnected ? undefined : connect} className="connect-btn">
            {isConnected ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>
      </nav>

      <div className="quote-section">
        <h2>
          <span className="title-line"><span>Compassion transcends borders</span></span>
          <span className="title-line"><span>weaving hearts together</span></span>
          <span className="title-line"><span>into gardens of hope</span></span>
          <span className="title-line"><span>where kindness blooms.</span></span>
        </h2>
      </div>

      <div className="preloader" id="preloader" ref={preloaderRef}>
        <div className="terminal-preloader">
          <div className="border-top">
            <span>Digital Garden Gateway</span>
            <span>Heart Connection Initiated</span>
          </div>

          <div className="terminal-container">
            {/* First block of text - before progress bar */}
            <div className="terminal-line" style={{top: '0px'}}>
              <span className="faded" data-scramble="true">Charitable Coordinates: Alpha/Hope/Prime</span>
              <span className="highlight" data-scramble="true">Hearts Aligned</span>
            </div>

            <div className="terminal-line" style={{top: '30px'}}>
              <span className="faded" data-scramble="true">Initiate Compassion Calibration</span>
              <span className="highlight" data-scramble="true">Kindness Detected</span>
            </div>

            <div className="terminal-line" style={{top: '60px'}}>
              <span className="highlight" data-scramble="true">Beginning Garden Unfolding</span>
            </div>

            <div className="terminal-line" style={{top: '90px'}}>
              <span className="highlight" data-scramble="true">Heart Matrices Synchronized</span>
            </div>

            {/* Progress bar with additional text */}
            <div className="progress-line">
              <span className="progress-label">Blooming</span>
              <div className="progress-container">
                <div className="progress-bar" id="progress-bar"></div>
              </div>
              <span className="highlight" style={{marginLeft: '10px'}} data-scramble="true">Garden Awakening</span>
            </div>

            {/* Second block of text - after progress bar */}
            <div className="terminal-line" style={{top: '165px'}}>
              <span className="highlight" data-scramble="true">Charitable Networks Stabilized</span>
            </div>

            <div className="terminal-line" style={{top: '195px'}}>
              <span className="highlight" data-scramble="true">HEART Tokens Blooming in Harmony</span>
            </div>

            <div className="terminal-line" style={{top: '225px'}}>
              <span className="highlight" data-scramble="true">Garden Portal Expanding</span>
            </div>

            <div className="terminal-line" style={{top: '255px'}}>
              <span className="highlight" data-scramble="true">Digital Garden Stabilizing</span>
            </div>

            <div className="terminal-line" style={{top: '285px'}}>
              <span className="highlight" data-scramble="true">Giving Reality Configured</span>
            </div>

            {/* Background faded lines */}
            <div className="terminal-line" style={{top: '15px'}}>
              <span className="faded" data-scramble="true">Heart Fluctuation Optimal</span>
            </div>

            <div className="terminal-line" style={{top: '45px'}}>
              <span className="faded" data-scramble="true">Initiating Kindness Fold</span>
            </div>

            <div className="terminal-line" style={{top: '75px'}}>
              <span className="faded" data-scramble="true">Scanning Charitable Realities</span>
            </div>

            <div className="terminal-line" style={{top: '105px'}}>
              <span className="faded" data-scramble="true">Analyzing Compassion Density</span>
            </div>

            <div className="terminal-line" style={{top: '180px'}}>
              <span className="faded" data-scramble="true">Processing Hope Frequencies</span>
            </div>

            <div className="terminal-line" style={{top: '210px'}}>
              <span className="faded" data-scramble="true">Calibrating Giving Displacement</span>
            </div>

            <div className="terminal-line" style={{top: '240px'}}>
              <span className="faded" data-scramble="true">Evaluating Heart Resonance</span>
            </div>

            <div className="terminal-line" style={{top: '270px'}}>
              <span className="faded" data-scramble="true">Stabilizing Kindness Flow</span>
            </div>
          </div>

          <div className="border-bottom">
            <span>Garden Sequence Complete</span>
            <span>Digital Heart Gateway Open</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container" id="content" ref={contentRef}>
      </div>
    </div>
  );
};

export default NewLanding;