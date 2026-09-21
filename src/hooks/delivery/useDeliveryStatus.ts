import { useUpdateDeliveryStatusMutation } from "@/services/api/activeDeliveryService";
import { DeliveryStatus } from "@/types/delivery";

export function useDeliveryStatus() {

    const [

        updateStatus,

        {

            isLoading,

            error

        }

    ] = useUpdateDeliveryStatusMutation();

    const changeStatus = async (

        deliveryId: string,

        status: DeliveryStatus

    ) => {

        return await updateStatus({

            id: deliveryId,

            status

        }).unwrap();

    };

    return {

        changeStatus,

        updating: isLoading,

        error

    };

}