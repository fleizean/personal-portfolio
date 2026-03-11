declare module 'react-simple-maps' {
  import { ComponentType, ReactNode, SVGProps } from 'react';

  export interface ProjectionConfig {
    rotate?: [number, number, number];
    scale?: number;
    center?: [number, number];
  }

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: ProjectionConfig;
    style?: React.CSSProperties;
    viewBox?: string;
    children?: ReactNode;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    onMoveStart?: (pos: { coordinates: [number, number]; zoom: number }) => void;
    onMove?: (pos: { x: number; y: number; k: number; dragging: boolean }) => void;
    onMoveEnd?: (pos: { coordinates: [number, number]; zoom: number }) => void;
    children?: ReactNode;
  }

  export interface SphereProps extends SVGProps<SVGPathElement> {
    id: string;
  }

  export interface GraticuleProps extends SVGProps<SVGPathElement> {}

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: GeoFeature[] }) => ReactNode;
  }

  export interface GeoFeature {
    rsmKey: string;
    id: string;
    properties: Record<string, unknown>;
    geometry: object;
    type: string;
  }

  export interface GeographyStyle {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    outline?: string;
    cursor?: string;
  }

  export interface GeographyProps {
    key?: string;
    geography: GeoFeature;
    style?: {
      default?: GeographyStyle;
      hover?: GeographyStyle;
      pressed?: GeographyStyle;
    };
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseMove?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onClick?: (event: React.MouseEvent) => void;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    children?: ReactNode;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Sphere: ComponentType<SphereProps>;
  export const Graticule: ComponentType<GraticuleProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
  export const Marker: ComponentType<MarkerProps>;
}
