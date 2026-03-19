'use client'
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

export default function Contador({ valor }: { valor: number }) {
    const spring = useSpring(0, {
        mass: 0.8,
        stiffness: 75,
        damping: 15,
    });

    const display = useTransform(spring, (current) =>
        new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(current)
    );

    useEffect(() => {
        spring.set(valor);
    }, [valor, spring]);

    return <motion.span>{display}</motion.span>;
}