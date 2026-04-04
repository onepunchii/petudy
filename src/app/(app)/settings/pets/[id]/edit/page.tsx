import { getPet } from "@/actions/pet";
import EditPetForm from "@/components/settings/EditPetForm";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface EditPetPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPetPage({ params }: EditPetPageProps) {
    const { id } = await params;
    const pet = await getPet(id);

    if (!pet) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-bg-main pb-24">
            {/* Header */}
            <div className="relative flex items-center justify-center h-[52px] bg-bg-main sticky top-0 z-50">
                <Link
                    href="/"
                    className="absolute left-4 w-6 h-6 flex items-center justify-center"
                >
                    <MoveLeft className="w-5 h-5 text-white" />
                </Link>
                <h1 className="text-base font-bold text-white">반려가족 수정</h1>
            </div>

            <EditPetForm
                petId={id}
                initialData={{
                    name: pet.name,
                    species: pet.species,
                    breed: pet.breed,
                    gender: pet.gender,
                    birth: pet.birth_date,
                    adoptionDate: pet.adoption_date,
                    weight: pet.weight,
                    color: pet.color,
                    neuter: pet.neuter,
                    concern: pet.concerns,
                    photo: pet.photo_url,
                    reg_number: pet.registration_number
                }}
            />
        </div>
    );
}
