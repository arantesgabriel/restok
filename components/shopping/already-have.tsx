import { House } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
export function AlreadyHave({name,onSelect,selected=false}:{name:string;onSelect:()=>void;selected?:boolean}) {return <IconButton label={selected?`Retirar ${name} de Já temos`:`Marcar ${name} como já temos`} aria-pressed={selected} onClick={onSelect}><House size={16}/></IconButton>;}
