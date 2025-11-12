# Fractal Glass Parallax Effect - Next.js Component

A stunning WebGL-powered glass distortion effect with mouse-tracking parallax, built as a reusable Next.js component using Three.js.

## Features

- 🎨 **Fractal Glass Effect**: Smooth, glass-like refraction distortion
- 🖱️ **Mouse Parallax**: Interactive mouse-following parallax effect
- ⚡ **Performance Optimized**: GPU-accelerated WebGL shaders
- 🔧 **Fully Configurable**: Customizable effect parameters
- 📱 **Responsive**: Works across all screen sizes
- 🎯 **TypeScript Support**: Full type safety

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```tsx
import GlassEffect from '@/components/GlassEffect';

export default function Home() {
  return (
    <GlassEffect imageSrc="/hero.jpg">
      <div className="hero-content">
        <h1>Your Content Here</h1>
      </div>
    </GlassEffect>
  );
}
```

### Advanced Configuration

```tsx
<GlassEffect
  imageSrc="/hero.jpg"
  config={{
    lerpFactor: 0.035,           // Mouse smoothing (0-1)
    parallaxStrength: 0.1,       // Parallax intensity
    distortionMultiplier: 10,    // Distortion impact on parallax
    glassStrength: 2.0,          // Glass effect intensity
    glassSmoothness: 0.0001,     // Glass smoothness detail
    stripesFrequency: 35,        // Number of glass stripes
    edgePadding: 0.1,            // Edge fade amount
  }}
>
  <YourContent />
</GlassEffect>
```

## Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `imageSrc` | `string` | Yes | - | Path to the image texture |
| `config` | `GlassEffectConfig` | No | See defaults | Effect configuration object |
| `className` | `string` | No | `''` | Additional CSS classes |
| `children` | `React.ReactNode` | No | - | Content to overlay on the effect |

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `lerpFactor` | `number` | `0.035` | Mouse movement smoothing factor (lower = smoother) |
| `parallaxStrength` | `number` | `0.1` | Intensity of the parallax effect |
| `distortionMultiplier` | `number` | `10` | How much distortion affects parallax |
| `glassStrength` | `number` | `2.0` | Intensity of the glass refraction effect |
| `glassSmoothness` | `number` | `0.0001` | Smoothness of glass detail |
| `stripesFrequency` | `number` | `35` | Number of glass refraction stripes |
| `edgePadding` | `number` | `0.1` | Edge smoothing/fade amount |

## Development

```bash
# Start Next.js development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Original Vite Version

The original Vite version is still available:

```bash
# Start Vite dev server
npm run dev:vite

# Build with Vite
npm run build:vite
```

## How It Works

The component uses WebGL shaders (via Three.js) to create the glass effect:

1. **Fractal Glass Algorithm**: Multiple displacement iterations create smooth glass-like refraction
2. **Parallax Integration**: Mouse position affects how the glass distortion shifts
3. **Edge Smoothing**: Prevents artifacts at screen edges
4. **Responsive Rendering**: Maintains performance across different screen sizes

## Technical Details

- **Framework**: Next.js 15 (App Router)
- **3D Library**: Three.js 0.175.0
- **Animation**: GSAP 3.13.0 (included for future use)
- **Language**: TypeScript 5.6+
- **Rendering**: WebGL with custom vertex and fragment shaders

## Browser Support

Works on all modern browsers that support WebGL:
- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- Opera 47+

## Credits

Original effect by **Worapon Jintajirakul** for Codegrid
Next.js component adaptation

## License

ISC
