import { useTheme } from '@/components/context/theme-context';
import { Colors as ColorsObj } from '@/constants/theme';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";

interface ButtonProps {
    type?: 'primary' | 'outlined' | 'success' | 'danger' | 'warning';
    text: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>
    disabled?: boolean;
    loading?: boolean;
}

export default function Button ({
    type = 'primary',
    text,
    onPress,
    style,
    disabled = false,
    loading = false,
}: ButtonProps) {
    const { colors } = useTheme();
    const dynamicStyles = getStyles(colors);
    const buttonStyle = [dynamicStyles.button, dynamicStyles[type], style, (disabled || loading) && dynamicStyles.disabled];

    const scale = useRef(new Animated.Value(1)).current;
    function handlePressIn() {
        if (disabled) return;
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
    }
    function handlePressOut() {
        if (disabled) return;
        Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
    }

    const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
    // Determine contrast color for button text based on background color
    function hexToRgb(hex: string) {
        if (!hex) return { r: 0, g: 0, b: 0 };
        let h = hex.replace('#', '');
        if (h.length === 8) h = h.slice(0, 6); // strip alpha
        if (h.length === 3) {
            h = h.split('').map(ch => ch + ch).join('');
        }
        const r = parseInt(h.substring(0,2), 16);
        const g = parseInt(h.substring(2,4), 16);
        const b = parseInt(h.substring(4,6), 16);
        return { r, g, b };
    }
    function isLightColor(hex: string) {
        try {
            const { r, g, b } = hexToRgb(hex);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128;
        } catch {
            return false;
        }
    }
    const bgColor = (dynamicStyles.button && (dynamicStyles.button as any).backgroundColor) || colors.tint;
    const useBlackText = isLightColor(bgColor as string);
    const defaultTextColor = type === 'outlined' ? colors.tint : (useBlackText ? '#000' : '#fff');
    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={[{ transform: [{ scale }] }, ...buttonStyle as any]}
            accessibilityRole="button"
        >
            <Text style={[dynamicStyles.buttonText, { color: defaultTextColor }, type === 'outlined' && dynamicStyles.buttonTextOutlined]}>
                {text}
            </Text>
        </AnimatedPressable>
    );
};

const getStyles = (colors: typeof ColorsObj.light) => StyleSheet.create({
    button: {
        backgroundColor: colors.tint,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    primary: {
        backgroundColor: colors.tint,
    },
    outlined: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.tint,
    },
    disabled: {
        opacity: 0.6,
    },
    success: {
        backgroundColor: '#44ff8cb9',
    },
    danger: {
        backgroundColor: '#FF3B30',
    },
    warning: {
        backgroundColor: '#FF9500',
    },
    buttonTextOutlined: {
        color: colors.tint,
    }
});