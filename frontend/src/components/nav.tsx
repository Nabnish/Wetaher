import InputExampleActionDropdown from "./searchbox.tsx";
export default function Nav(){
    return(
        <>
            <div className="bg-opacity-0 border-b-4 border-white fixed min-h-24 h-14 min-w-full  ">
                <div className="flex flex-row mt-auto justify-center items-center">
                    <InputExampleActionDropdown />
                </div>
                
            </div>
        </>
    );
}