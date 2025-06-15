
export function FolderIcon() {
    return (
        <div className="relative w-full h-56 rounded-xl flex flex-col-reverse group">
            {/* Capa */}
            <div className="flex flex-col justify-end w-8/10 h-8/10 bg-[rgb(255,200,67)] dark:bg-[rgb(255,200,67)] z-50 rounded-tr-lg rounded-bl-lg p-2 shadow-[3px_0px_4px_rgba(0,0,0,0.25)] relative">
                🚀
                <h2 className='text-xl align-text-bottom font-semibold text-muted-foreground text-left text-wrap'>
                    Usaremos seu nome apenas
                </h2>
                {/* Trapézio anexado */}
                <div
                    className="absolute right-[-19px] top-1/2 -translate-y-1/2 bg-[rgb(255,200,67)] shadow-[3px_0px_4px_rgba(0,0,0,0.25)]"
                    style={{ width: '30px', height: '100px', clipPath: 'polygon(0 0, 70% 20%, 70% 80%, 0 100%)' }}
                />
            </div>

            <div className="absolute w-full h-full bg-[hsl(43,74%,54%)] dark:bg-[rgb(224,173,49)] rounded-lg p-2 z-0">
                <div className="w-full h-full bg-white dark:bg-white rounded-sm p-2">
                    <iframe src="https://images.pexels.com/photos/1526713/pexels-photo-1526713.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                        className="w-full h-full transition-transform duration-500 ease-in-out group-hover:-translate-y-8 group-hover:rotate-6 group-hover:translate-x-6">
                    </iframe>
                </div>
            </div>
        </div>
    )
}