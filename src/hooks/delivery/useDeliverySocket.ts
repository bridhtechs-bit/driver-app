import { useEffect, useState } from "react";

import {

    subscribeToNewDelivery,

    subscribeToActiveDelivery,

} from "@/services/socket/deliverySocket";

type DeliverySocketOptions = {

    onNewDelivery?: () => void;

    onDeliveryUpdated?: (delivery: any) => void;

    onDeliveryCancelled?: (payload: any) => void;

};

export function useDeliverySocket({

    onNewDelivery,

    onDeliveryUpdated,

    onDeliveryCancelled,

}: DeliverySocketOptions) {

    const [connected, setConnected] =
        useState(false);

    useEffect(() => {

        let unsubscribeNew:
            (() => void) | undefined;

        let unsubscribeActive:
            (() => void) | undefined;

        async function subscribe() {

            unsubscribeNew =
                await subscribeToNewDelivery(() => {

                    onNewDelivery?.();

                });

            unsubscribeActive =
                await subscribeToActiveDelivery(

                    (delivery) => {

                        onDeliveryUpdated?.(delivery);

                    },

                    (payload) => {

                        onDeliveryCancelled?.(payload);

                    }

                );

            setConnected(true);

        }

        subscribe();

        return () => {

            unsubscribeNew?.();

            unsubscribeActive?.();

            setConnected(false);

        };

    }, [

        onNewDelivery,

        onDeliveryUpdated,

        onDeliveryCancelled,

    ]);

    return {

        connected,

    };

}