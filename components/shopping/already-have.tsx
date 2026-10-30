import { House } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
export function AlreadyHave({name,onSelect}:{name:string;onSelect:()=>void}) {return <IconButton label={`Marcar ${name} como já temos`} onClick={onSelect}><House size={18}/></IconButton>;}
