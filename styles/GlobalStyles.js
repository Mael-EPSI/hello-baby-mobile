export const Colors = {
  // Palette principale moderne
  primary: '#6366F1', // Indigo moderne
  primaryLight: '#A5B4FC',
  primaryDark: '#4338CA',
  
  // Couleurs d'accent
  accent: '#F59E0B', // Orange chaleureux
  accentLight: '#FCD34D',
  
  // Couleurs de statut
  success: '#10B981', // Vert émeraude
  warning: '#F59E0B', // Orange
  error: '#EF4444', // Rouge moderne
  info: '#3B82F6', // Bleu
  
  // Couleurs neutres
  background: '#F8FAFC', // Gris très clair
  surface: '#FFFFFF',
  surfaceSecondary: '#F1F5F9',
  
  // Textes
  text: '#1E293B', // Gris foncé
  textSecondary: '#64748B', // Gris moyen
  textLight: '#94A3B8', // Gris clair
  
  // Bordures et séparateurs
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  
  // Autres couleurs utiles
  gray: '#6B7280',
  lightGray: '#F3F4F6',
  darkGray: '#374151',
  
  // Couleurs spéciales pour l'app baby
  babyPink: '#FDF2F8',
  babyBlue: '#EFF6FF',
  babyYellow: '#FFFBEB',
  babyGreen: '#F0FDF4',
};

export const Typography = {
  // Titres
  h1: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 40,
    color: Colors.text,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    color: Colors.text,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: Colors.text,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: Colors.text,
  },
  
  // Corps de texte
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: Colors.text,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: Colors.text,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  
  // Légendes et labels
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: Colors.text,
  },
  
  // Boutons
  button: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const Shadows = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
};

// Composants de style prêts à l'emploi
export const Buttons = {
  primary: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  secondary: {
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.xs,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: Colors.surfaceSecondary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export const Inputs = {
  default: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
    color: Colors.text,
  },
  focused: {
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  error: {
    borderColor: Colors.error,
  },
};

export const Cards = {
  default: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  elevated: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    ...Shadows.md,
  },
  outlined: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  baby: {
    backgroundColor: Colors.babyPink,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.accent + '20',
    ...Shadows.xs,
  },
};

export const Animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  slideUp: {
    from: { translateY: 50, opacity: 0 },
    to: { translateY: 0, opacity: 1 },
  },
  scale: {
    from: { scale: 0.9, opacity: 0 },
    to: { scale: 1, opacity: 1 },
  },
};

// Layout
export const Layout = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
};
