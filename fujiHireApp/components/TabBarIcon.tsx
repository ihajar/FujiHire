import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";

type TabBarIconProps = {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
    size?: number;
};

export default function TabBarIcon({ name, color, size = 24 }: TabBarIconProps) {
    return (
        <FontAwesome
            name={name}
            color={color}
            size={size}
            className="-mb-1"
        />
    )
}