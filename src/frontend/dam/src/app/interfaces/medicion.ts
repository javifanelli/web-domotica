export interface Medicion {
    medicionId?: number,
    dispositivoId: string,
    tipo: string,
    fecha: string,
    valor: string,
    set_point: number,
    modo: string,
    salida: number,
    hon: number,
    mon: number,
    hoff: number,
    moff: number
}