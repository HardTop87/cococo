/**
 * Network Animation for IPN Landing Page
 * Creates an animated constellation/network effect with AI pulses
 */

class NetworkAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.pulses = [];
        
        // Configuration
        this.config = {
            nodeCount: this.isMobile() ? 40 : 80, // Reduce nodes on mobile
            maxDistance: 150,
            nodeSize: 2.5,
            nodeColor: 'rgba(220, 235, 255, 0.85)', // Much lighter for visibility on #486a8d
            lineColor: 'rgba(200, 225, 255, 0.25)', // Brighter lines
            pulseColor: '#FF79C9', // Neon pink
            pulseSpeed: 2, // Speed of pulse animation
            pulseInterval: 400, // Create pulse every 0.4 seconds (more frequent)
            nodeSpeed: 0.3,
            pathLength: this.isMobile() ? 3 : 4 // Number of nodes in pulse path
        };
        
        // Store device pixel ratio for sharp rendering
        this.pixelRatio = window.devicePixelRatio || 1;
        
        this.init();
    }
    
    isMobile() {
        return window.innerWidth < 768;
    }
    
    init() {
        this.resize();
        this.createNodes();
        this.animate();
        
        // Handle resize with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resize();
                // Recreate nodes if switching between mobile/desktop
                const newNodeCount = this.isMobile() ? 40 : 80;
                if (newNodeCount !== this.config.nodeCount) {
                    this.config.nodeCount = newNodeCount;
                    this.createNodes();
                }
            }, 250);
        });
        
        // Start pulse creation
        setInterval(() => this.createPulse(), this.config.pulseInterval);
    }
    
    resize() {
        // Get pixel ratio for Retina displays
        const ratio = window.devicePixelRatio || 1;
        
        // Set display size (CSS pixels)
        const width = this.canvas.offsetWidth;
        const height = this.canvas.offsetHeight;
        
        // Set actual size in memory (scaled for Retina)
        this.canvas.width = width * ratio;
        this.canvas.height = height * ratio;
        
        // Normalize coordinate system to use CSS pixels
        this.ctx.scale(ratio, ratio);
        
        // Store dimensions for drawing
        this.width = width;
        this.height = height;
    }
    
    createNodes() {
        this.nodes = [];
        const width = this.width || this.canvas.offsetWidth;
        const height = this.height || this.canvas.offsetHeight;
        
        for (let i = 0; i < this.config.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * this.config.nodeSpeed,
                vy: (Math.random() - 0.5) * this.config.nodeSpeed,
                radius: this.config.nodeSize
            });
        }
    }
    
    createPulse() {
        if (this.nodes.length < this.config.pathLength) return;
        
        // Create a path of connected nodes
        const path = [];
        let currentNode = this.nodes[Math.floor(Math.random() * this.nodes.length)];
        path.push(currentNode);
        
        // Build path by finding connected nodes
        for (let i = 1; i < this.config.pathLength; i++) {
            const possibleNext = this.nodes.filter(node => {
                if (path.includes(node)) return false;
                const dx = node.x - currentNode.x;
                const dy = node.y - currentNode.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance < this.config.maxDistance;
            });
            
            if (possibleNext.length === 0) break;
            
            currentNode = possibleNext[Math.floor(Math.random() * possibleNext.length)];
            path.push(currentNode);
        }
        
        // Only create pulse if we have at least 2 nodes in path
        if (path.length >= 2) {
            this.pulses.push({
                path: path.map(node => ({ x: node.x, y: node.y })),
                progress: 0,
                opacity: 1
            });
        }
    }
    
    updateNodes() {
        const width = this.width || this.canvas.offsetWidth;
        const height = this.height || this.canvas.offsetHeight;
        
        this.nodes.forEach(node => {
            // Update position
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > width) node.vx *= -1;
            if (node.y < 0 || node.y > height) node.vy *= -1;
            
            // Keep within bounds
            node.x = Math.max(0, Math.min(width, node.x));
            node.y = Math.max(0, Math.min(height, node.y));
        });
    }
    
    updatePulses() {
        this.pulses = this.pulses.filter(pulse => {
            // Slower speed for multi-node paths to see them longer
            pulse.progress += this.config.pulseSpeed / 150;
            pulse.opacity = Math.max(0.3, 1 - pulse.progress); // Keep minimum opacity
            return pulse.progress < 1;
        });
    }
    
    drawNodes() {
        this.nodes.forEach(node => {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.config.nodeColor;
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        this.ctx.strokeStyle = this.config.lineColor;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[j].x - this.nodes[i].x;
                const dy = this.nodes[j].y - this.nodes[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.maxDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    drawPulses() {
        this.pulses.forEach(pulse => {
            const path = pulse.path;
            if (path.length < 2) return;
            
            // Calculate total path length
            let totalLength = 0;
            const segmentLengths = [];
            for (let i = 0; i < path.length - 1; i++) {
                const dx = path[i + 1].x - path[i].x;
                const dy = path[i + 1].y - path[i].y;
                const length = Math.sqrt(dx * dx + dy * dy);
                segmentLengths.push(length);
                totalLength += length;
            }
            
            // Find current segment and position
            let currentDistance = pulse.progress * totalLength;
            let segmentIndex = 0;
            let segmentProgress = 0;
            
            for (let i = 0; i < segmentLengths.length; i++) {
                if (currentDistance <= segmentLengths[i]) {
                    segmentIndex = i;
                    segmentProgress = currentDistance / segmentLengths[i];
                    break;
                }
                currentDistance -= segmentLengths[i];
            }
            
            // Current position on path
            const currentSegment = Math.min(segmentIndex, path.length - 2);
            const start = path[currentSegment];
            const end = path[currentSegment + 1];
            const currentX = start.x + (end.x - start.x) * segmentProgress;
            const currentY = start.y + (end.y - start.y) * segmentProgress;
            
            // Draw the entire path with fading effect
            this.ctx.lineWidth = 2.5;
            for (let i = 0; i < path.length - 1; i++) {
                // Determine opacity based on pulse progress
                let segmentOpacity = 0;
                if (i < currentSegment) {
                    // Already passed - fading out
                    segmentOpacity = pulse.opacity * 0.4;
                } else if (i === currentSegment) {
                    // Current segment - full brightness
                    segmentOpacity = pulse.opacity;
                } else {
                    // Not yet reached - dim
                    segmentOpacity = pulse.opacity * 0.15;
                }
                
                this.ctx.strokeStyle = `rgba(255, 121, 201, ${segmentOpacity})`;
                this.ctx.beginPath();
                this.ctx.moveTo(path[i].x, path[i].y);
                this.ctx.lineTo(path[i + 1].x, path[i + 1].y);
                this.ctx.stroke();
            }
            
            // Draw pulse point
            this.ctx.beginPath();
            this.ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 121, 201, ${pulse.opacity})`;
            this.ctx.fill();
            
            // Glow effect
            this.ctx.beginPath();
            this.ctx.arc(currentX, currentY, 9, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 121, 201, ${pulse.opacity * 0.4})`;
            this.ctx.fill();
        });
    }
    
    animate() {
        // Clear canvas (use CSS dimensions)
        const width = this.width || this.canvas.offsetWidth;
        const height = this.height || this.canvas.offsetHeight;
        this.ctx.clearRect(0, 0, width, height);
        
        // Update
        this.updateNodes();
        this.updatePulses();
        
        // Draw
        this.drawConnections();
        this.drawNodes();
        this.drawPulses();
        
        // Continue animation
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NetworkAnimation('networkCanvas');
    });
} else {
    new NetworkAnimation('networkCanvas');
}
