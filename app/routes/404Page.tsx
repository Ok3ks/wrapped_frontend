import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const NotFoundPage: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const width = 500;
    const height = 300;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', '#f0f0f0');

    // Generate random circle data for visualization
    const circlesData = d3.range(15).map(() => ({
      cx: Math.random() * width,
      cy: Math.random() * height,
      r: Math.random() * 20 + 10,
    }));

    // Enter selection: Add circles and animate their appearance
    svg
      .selectAll('circle')
      .data(circlesData)
      .enter()
      .append('circle')
      .attr('cx', (d) => d.cx)
      .attr('cy', (d) => d.cy)
      .attr('r', 0)
      .attr('fill', 'teal')
      .transition()
      .duration(1500)
      .attr('r', (d) => d.r)
      .attr('fill', 'orange')
      .transition()
      .delay(1500)
      .duration(2000)
      .attr('cx', () => Math.random() * width)
      .attr('cy', () => Math.random() * height);

    // Cleanup on component unmount
    return () => {
      svg.selectAll('*').interrupt();
    };
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
      }}
    >
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>404 - Page Not Found</h1>
      <p style={{ marginBottom: '20px' }}>
        Oops! It looks like you've wandered off the beaten path. But to lighten the mood, enjoy this fun D3.js
        visualization!
      </p>
      <svg ref={svgRef}></svg>
      <a
        href="/"
        style={{ color: '#0070f3', textDecoration: 'underline', marginTop: '20px', fontSize: '1.2rem' }}
      >
        Go Back Home
      </a>
    </div>
  );
};

export default NotFoundPage;
