import React from "react";
import { useParams } from "react-router-dom";
import ProductDetail from "@/components/product-details";

export default function ProductDetailsPage() {
    const { id } = useParams();

    return (
        <div className="py-8">
            <ProductDetail productId={id} />
        </div>
    );
}
