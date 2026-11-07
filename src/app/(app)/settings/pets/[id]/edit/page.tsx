import { getPet } from "@/actions/pet";
import EditPetForm from "@/components/settings/EditPetForm";
import { AppTopBar } from "@/components/app/ui";
import { notFound } from "next/navigation";

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
        <div className="flex min-h-full flex-col">
            {/* 뒤로 가기는 예전처럼 항상 /app 으로 가는 링크 */}
            <AppTopBar title="반려가족 수정" backHref="/app" />

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
