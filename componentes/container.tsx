type ContainerProps = {
    children: React.ReactNode
}

export default function Container({ children }: ContainerProps) {
    return (
        <div className="
            bg-zinc-900/80 
            backdrop-blur-md
            w-11/12 
            max-w-7xl 
            rounded-3xl 
            p-8 
            mt-8 
            border border-zinc-800/50 
            shadow-[0_20px_50px_rgba(0,0,0,0.5)]
        ">
            {children}
        </div>
    )
}