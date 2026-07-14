import { useEffect, useState } from 'react';

interface BidCountdownProps {
    listingEnd: string;
}

export default function Countdown({ listingEnd }: BidCountdownProps) {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        function tick() {
            const diff = new Date(listingEnd).getTime() - Date.now();
            if (diff <= 0) { setTimeLeft('Listing ended'); return; }

            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff / 3600000) % 24);
            const m = Math.floor((diff / 60000) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${d}d ${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`);
        }

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [listingEnd]);

    return <span className="ip-countdown">{timeLeft}</span>;
}