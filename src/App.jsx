import React, { useState, useEffect, useRef } from 'react';
import {
  Crown,
  Scissors,
  MapPin,
  Clock,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  Star,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Calendar,
  Plus,
  Minus,
  Trash2,
  Receipt,
  Monitor,
  Wallet,
  Lock,
  Users,
  TrendingUp,
  Play,
  Printer,
  Send,
  FileCheck2,
  Webhook,
  ArrowUpRight,
  RefreshCw,
  Check,
  AlertCircle,
  CreditCard,
  Building2,
  LogOut
} from 'lucide-react';

// ============================================================================
// CATÁLOGO MAESTRO DE DATOS (SEDES, SERVICIOS, BARBEROS, HORARIOS)
// ============================================================================
const LOCATIONS = [
  {
    id: 'nuevo-chimbote',
    name: 'Nuevo Chimbote (Frente al BCP)',
    shortName: 'Nuevo Chimbote',
    reference: 'Frente al BCP - Av. Pacífico',
    wait: 'Atención rápida',
    tag: 'Sede Principal'
  },
  {
    id: 'chimbote-centro',
    name: 'Chimbote Centro (Plaza Santander)',
    shortName: 'Chimbote Centro',
    reference: 'Plaza Santander - Centro',
    wait: 'Sillas disponibles',
    tag: 'Sede Centro'
  }
];

const SERVICES = [
  {
    id: 'degradado',
    name: 'Degradado',
    subtitle: 'Skin Fade / Mid / Drop Fade + Diseño',
    price: 25,
    duration: '35 min',
    popular: true,
    includes: 'Incluye mascarilla puntos negros + masaje'
  },
  {
    id: 'clasico',
    name: 'Clásico',
    subtitle: 'Corte ejecutivo a tijera y máquina',
    price: 20,
    duration: '30 min',
    popular: false,
    includes: 'Incluye mascarilla puntos negros + masaje'
  },
  {
    id: 'vip',
    name: 'Servicio VIP',
    subtitle: 'Corte + Barba con toalla caliente + Exfoliación profunda',
    price: 40,
    duration: '50 min',
    popular: true,
    includes: 'Incluye mascarilla puntos negros + masaje extendido'
  }
];

const POS_ADDONS = [
  {
    id: 'cejas',
    name: 'Perfilado de Cejas a Navaja',
    price: 5,
    category: 'Adicional'
  },
  {
    id: 'barba',
    name: 'Ritual de Barba & Toalla Caliente',
    price: 15,
    category: 'Adicional'
  },
  {
    id: 'cera',
    name: 'Cera Mate King’s (Producto)',
    price: 25,
    category: 'Producto'
  }
];

const BARBERS = [
  {
    id: 'cristobal',
    name: 'Cristóbal',
    role: 'Líder & Master Barber',
    badge: 'Líder',
    initials: 'CR',
    rating: '5.0',
    chairId: 1
  },
  {
    id: 'kevin',
    name: 'Kevin',
    role: 'Especialista en Degradados',
    badge: 'Top Fade',
    initials: 'KV',
    rating: '4.9',
    chairId: 2
  },
  {
    id: 'brian',
    name: 'Brian',
    role: 'Clásico & Ritual Barba',
    badge: 'Senior',
    initials: 'BR',
    rating: '4.9',
    chairId: 3
  }
];

const TIME_SLOTS = [
  '10:00 AM',
  '10:45 AM',
  '11:30 AM',
  '12:15 PM',
  '03:30 PM',
  '04:15 PM',
  '05:00 PM',
  '06:00 PM'
];

// ============================================================================
// ESTADO OPERATIVO INICIAL COMPARTIDO ENTRE WEB PÚBLICA Y ADMIN CORE
// ============================================================================
const INITIAL_CHAIRS = [
  {
    chairId: 1,
    chairName: 'Silla 1',
    barberId: 'cristobal',
    barberName: 'Cristóbal',
    barberRole: 'Líder',
    initials: 'CR',
    status: 'busy', // 'busy' | 'available'
    clientName: 'Mateo Villavicencio',
    serviceId: 'vip',
    serviceName: 'Servicio VIP',
    price: 40,
    elapsedSeconds: 1340, // 22m 20s
    idleMinutes: 0
  },
  {
    chairId: 2,
    chairName: 'Silla 2',
    barberId: 'kevin',
    barberName: 'Kevin',
    barberRole: 'Especialista Fade',
    initials: 'KV',
    status: 'available',
    clientName: null,
    serviceId: null,
    serviceName: null,
    price: 0,
    elapsedSeconds: 0,
    idleMinutes: 14
  },
  {
    chairId: 3,
    chairName: 'Silla 3',
    barberId: 'brian',
    barberName: 'Brian',
    barberRole: 'Senior Barber',
    initials: 'BR',
    status: 'busy',
    clientName: 'Sebastián Paredes',
    serviceId: 'degradado',
    serviceName: 'Degradado',
    price: 25,
    elapsedSeconds: 915, // 15m 15s
    idleMinutes: 0
  }
];

const INITIAL_WAITING_QUEUE = [
  {
    id: 'q-101',
    clientName: 'Alejandro Morales',
    phone: '943 812 901',
    location: 'Nuevo Chimbote (Frente al BCP)',
    serviceId: 'degradado',
    serviceName: 'Degradado',
    price: 25,
    barberId: 'kevin',
    barberName: 'Kevin',
    time: '11:30 AM',
    source: 'Webhook n8n • Web',
    isNew: false
  },
  {
    id: 'q-102',
    clientName: 'Rodrigo Alzamora',
    phone: '951 204 338',
    location: 'Nuevo Chimbote (Frente al BCP)',
    serviceId: 'vip',
    serviceName: 'Servicio VIP',
    price: 40,
    barberId: 'cristobal',
    barberName: 'Cristóbal',
    time: '12:15 PM',
    source: 'Webhook n8n • WhatsApp',
    isNew: false
  },
  {
    id: 'q-103',
    clientName: 'Fabricio Luna',
    phone: '988 119 402',
    location: 'Chimbote Centro (Plaza Santander)',
    serviceId: 'clasico',
    serviceName: 'Clásico',
    price: 20,
    barberId: 'brian',
    barberName: 'Brian',
    time: '03:30 PM',
    source: 'Presencial',
    isNew: false
  }
];

const INITIAL_TRANSACTIONS = [
  {
    id: 'B001-000449',
    barberId: 'cristobal',
    barberName: 'Cristóbal',
    clientName: 'Carlos Mendoza',
    itemsDescription: 'Servicio VIP',
    total: 40,
    time: '09:45 AM'
  },
  {
    id: 'B001-000450',
    barberId: 'kevin',
    barberName: 'Kevin',
    clientName: 'Diego Salazar',
    itemsDescription: 'Degradado + Perfilado de Cejas',
    total: 30,
    time: '10:15 AM'
  },
  {
    id: 'B001-000451',
    barberId: 'brian',
    barberName: 'Brian',
    clientName: 'Jorge Espinoza',
    itemsDescription: 'Clásico',
    total: 20,
    time: '10:35 AM'
  }
];

// Formateador de segundos a MM:SS
const formatTimer = (totalSeconds) => {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// ============================================================================
// VISTA 1: WEB PÚBLICA (Clean & Premium, Mobile-First & Responsive)
// ============================================================================
function PublicBookingView({ onNewBooking, onOpenAdmin }) {
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0].id);
  const [selectedService, setSelectedService] = useState(SERVICES[0].id);
  const [selectedBarber, setSelectedBarber] = useState(BARBERS[0].id);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[2]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');

  // Estados de disparo de Webhook a n8n y pantalla de éxito
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  const funnelRef = useRef(null);

  const currentLocObj = LOCATIONS.find((l) => l.id === selectedLocation);
  const currentSrvObj = SERVICES.find((s) => s.id === selectedService);
  const currentBrbObj = BARBERS.find((b) => b.id === selectedBarber);

  const scrollToFunnel = () => {
    funnelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setIsSendingWebhook(true);

    const finalName = clientName.trim() || 'Cliente Web VIP';
    const finalPhone = clientPhone.trim() || '943 000 777';

    // Simulación realista de disparo de Webhook hacia n8n (650ms)
    setTimeout(() => {
      const payload = {
        id: `q-${Date.now()}`,
        clientName: finalName,
        phone: finalPhone,
        location: currentLocObj.name,
        serviceId: currentSrvObj.id,
        serviceName: currentSrvObj.name,
        price: currentSrvObj.price,
        barberId: currentBrbObj.id,
        barberName: currentBrbObj.name,
        time: selectedTime,
        source: 'Webhook n8n • Web',
        webhookTimestamp: new Date().toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        isNew: true
      };

      onNewBooking(payload);
      setIsSendingWebhook(false);
      setBookingConfirmed(payload);
    }, 650);
  };

  const handleResetBooking = () => {
    setBookingConfirmed(null);
    setClientName('');
    setClientPhone('');
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col justify-between selection:bg-amber-500 selection:text-white">
      {/* ====================================================================
          BARRA DE NAVEGACIÓN SUPERIOR (Clean & Premium)
      ==================================================================== */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-950 flex items-center justify-center ring-2 ring-amber-500/80 shadow-sm">
              <Crown className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-neutral-950 block leading-none">
                KING&apos;S BARBER SHOP
              </span>
              <span className="text-[11px] font-semibold text-amber-600 tracking-wider uppercase">
                Chimbote &amp; Nuevo Chimbote
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={scrollToFunnel}
            className="cursor-pointer px-4 py-2 rounded-full bg-neutral-950 text-white text-xs sm:text-sm font-bold hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-500" />
            <span>Reservar Cita</span>
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* ====================================================================
            1. HERO SECTION + 2. PROPUESTA DE VALOR DIFERENCIADORA
        ==================================================================== */}
        <section className="relative overflow-hidden pt-10 pb-12 sm:py-16 border-b border-neutral-100">
          {/* Destello sutil dorado de fondo */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[36rem] h-[18rem] bg-amber-400/10 rounded-full blur-3xl" />

          <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-500/30 text-neutral-900 text-xs font-bold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>EXPERIENCIA URBANA PREMIUM • CERO COLAS</span>
            </div>

            {/* Titular Principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-neutral-950 leading-[1.06] mb-4">
              Tu estilo,{' '}
              <span className="underline decoration-amber-500 decoration-4 underline-offset-8">
                sin esperar de más.
              </span>
            </h1>

            {/* Subtítulo */}
            <p className="text-base sm:text-xl text-neutral-600 max-w-xl font-medium mb-8">
              Elige tu sede y separa tu silla en segundos.
            </p>

            {/* Botón Negro CTA: "Agendar Corte" */}
            <button
              type="button"
              onClick={scrollToFunnel}
              className="cursor-pointer group px-8 py-4 rounded-2xl bg-neutral-950 text-white font-black text-base sm:text-lg tracking-tight shadow-[0_14px_30px_rgba(0,0,0,0.18)] hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] transition-all duration-300 flex items-center gap-3"
            >
              <span>Agendar Corte</span>
              <div className="w-7 h-7 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>

            {/* 2. PROPUESTA DE VALOR (Extraída del diagnóstico) */}
            <div className="mt-10 w-full max-w-3xl rounded-3xl bg-gradient-to-r from-amber-50/90 via-white to-amber-50/90 border-2 border-amber-500/40 p-5 sm:p-6 shadow-[0_10px_35px_rgba(245,158,11,0.1)] flex flex-col sm:flex-row items-center gap-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-neutral-950 text-amber-500 flex items-center justify-center shrink-0 ring-4 ring-amber-500/20">
                <Crown className="w-7 h-7" />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Beneficio Exclusivo King&apos;s Incluido Gratis</span>
                </div>
                <p className="text-base sm:text-lg font-extrabold text-neutral-950 leading-snug">
                  &ldquo;Todos nuestros servicios incluyen mascarilla de puntos negros y masajes
                  relajantes.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================================
            3. EMBUDO DE RESERVA MOBILE-FIRST (4 Pasos Interactivos o Éxito)
        ==================================================================== */}
        <section ref={funnelRef} className="py-12 sm:py-16 scroll-mt-16 bg-neutral-50/60">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            {bookingConfirmed ? (
              /* PANTALLA DE ÉXITO POST-WEBHOOK N8N */
              <div className="bg-white border-2 border-amber-500 rounded-3xl p-7 sm:p-10 shadow-2xl text-center space-y-6 animate-in fade-in duration-300">
                <div className="w-20 h-20 rounded-full bg-neutral-950 text-amber-500 ring-8 ring-amber-500/15 mx-auto flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-500/30 text-emerald-700 text-xs font-extrabold uppercase tracking-wider">
                    <Webhook className="w-3.5 h-3.5" /> Webhook n8n Disparado • Cita Sincronizada
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-neutral-950">
                    ¡Reserva Confirmada!
                  </h2>
                  <p className="text-base sm:text-lg font-bold text-amber-600">
                    Te hemos enviado los detalles por WhatsApp
                  </p>
                </div>

                {/* Resumen del Ticket Confirmado */}
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 text-left space-y-3 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-xs border-b border-neutral-200 pb-2.5">
                    <span className="font-extrabold uppercase tracking-wider text-neutral-500">
                      Resumen de tu Silla
                    </span>
                    <span className="font-bold text-amber-600">{bookingConfirmed.time}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Cliente:</span>
                      <strong className="text-neutral-900">{bookingConfirmed.clientName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Sede:</span>
                      <strong className="text-neutral-900 text-right">
                        {bookingConfirmed.location}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Servicio:</span>
                      <strong className="text-neutral-900">{bookingConfirmed.serviceName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Barbero:</span>
                      <strong className="text-neutral-900">{bookingConfirmed.barberName}</strong>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-neutral-200 text-base">
                      <span className="font-bold text-neutral-900">Total a pagar en local:</span>
                      <strong className="font-black text-amber-600">
                        S/ {bookingConfirmed.price}.00
                      </strong>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-500/30 rounded-xl p-3 text-xs text-neutral-800 font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>
                      Incluye gratis tu mascarilla de puntos negros y masaje relajante.
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2 max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={handleResetBooking}
                    className="cursor-pointer flex-1 py-3.5 px-5 rounded-xl border-2 border-neutral-900 text-neutral-900 font-extrabold text-sm hover:bg-neutral-100 transition-all"
                  >
                    Hacer otra reserva
                  </button>
                  <button
                    type="button"
                    onClick={onOpenAdmin}
                    className="cursor-pointer flex-1 py-3.5 px-5 rounded-xl bg-neutral-950 text-white font-extrabold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Ver en Monitor Admin</span>
                    <ArrowUpRight className="w-4 h-4 text-amber-500" />
                  </button>
                </div>
              </div>
            ) : (
              /* FORMULARIO EMBUDO DE 4 PASOS */
              <form
                onSubmit={handleConfirmBooking}
                className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-9"
              >
                {/* Encabezado del Embudo */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-5">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 block">
                      Reserva Express en 4 Pasos
                    </span>
                    <h2 className="text-2xl font-black text-neutral-950">
                      Configura tu experiencia
                    </h2>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-500/30 flex items-center justify-center text-amber-500">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>

                {/* PASO 1: ZONA */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-neutral-950 text-amber-500 font-black text-xs flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-lg font-extrabold text-neutral-950">Elige tu Sede</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {LOCATIONS.map((loc) => {
                      const isSelected = selectedLocation === loc.id;
                      return (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => setSelectedLocation(loc.id)}
                          className={`cursor-pointer text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] flex flex-col justify-between gap-2 ${
                            isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white ring-2 ring-amber-500/60 shadow-lg'
                              : 'border-neutral-200 bg-white text-neutral-900 hover:border-amber-500/60'
                          }`}
                        >
                          <div className="flex items-start justify-between w-full gap-2">
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-amber-500 text-neutral-950'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}
                            >
                              {loc.tag}
                            </span>
                            <MapPin
                              className={`w-4 h-4 shrink-0 ${
                                isSelected ? 'text-amber-500' : 'text-amber-500'
                              }`}
                            />
                          </div>

                          <div>
                            <p className="font-extrabold text-base leading-snug">{loc.name}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isSelected ? 'text-neutral-300' : 'text-neutral-500'
                              }`}
                            >
                              {loc.wait}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PASO 2: SERVICIOS */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-neutral-950 text-amber-500 font-black text-xs flex items-center justify-center">
                        2
                      </span>
                      <h3 className="text-lg font-extrabold text-neutral-950">
                        Selecciona tu Servicio
                      </h3>
                    </div>
                    <span className="text-xs font-bold text-amber-600">+ Mascarilla y Masaje</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {SERVICES.map((srv) => {
                      const isSelected = selectedService === srv.id;
                      return (
                        <button
                          key={srv.id}
                          type="button"
                          onClick={() => setSelectedService(srv.id)}
                          className={`cursor-pointer text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] flex flex-col justify-between gap-3 ${
                            isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white ring-2 ring-amber-500/60 shadow-lg'
                              : 'border-neutral-200 bg-white text-neutral-900 hover:border-amber-500/60'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-base">{srv.name}</span>
                              <span
                                className={`text-sm font-black px-2.5 py-0.5 rounded-lg ${
                                  isSelected
                                    ? 'bg-amber-500 text-neutral-950'
                                    : 'bg-amber-50 text-amber-700 border border-amber-500/30'
                                }`}
                              >
                                S/ {srv.price}
                              </span>
                            </div>
                            <p
                              className={`text-xs leading-relaxed ${
                                isSelected ? 'text-neutral-300' : 'text-neutral-500'
                              }`}
                            >
                              {srv.subtitle}
                            </p>
                          </div>

                          <div
                            className={`text-[11px] font-semibold pt-2 border-t flex items-center gap-1 ${
                              isSelected
                                ? 'border-white/15 text-amber-400'
                                : 'border-neutral-100 text-amber-600'
                            }`}
                          >
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span>{srv.duration} • Mascarilla gratis</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PASO 3: BARBERO */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-full bg-neutral-950 text-amber-500 font-black text-xs flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-lg font-extrabold text-neutral-950">Elige tu Barbero</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {BARBERS.map((barber) => {
                      const isSelected = selectedBarber === barber.id;
                      return (
                        <button
                          key={barber.id}
                          type="button"
                          onClick={() => setSelectedBarber(barber.id)}
                          className={`cursor-pointer p-4 rounded-2xl border-2 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] flex flex-col items-center ${
                            isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white ring-2 ring-amber-500/60 shadow-lg'
                              : 'border-neutral-200 bg-white text-neutral-900 hover:border-amber-500/60'
                          }`}
                        >
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2.5 ${
                              isSelected
                                ? 'bg-amber-500 text-neutral-950'
                                : 'bg-amber-50 text-amber-700 border border-amber-500/30'
                            }`}
                          >
                            {barber.badge}
                          </span>

                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center text-base font-black mb-2 ring-2 ${
                              isSelected
                                ? 'bg-amber-500 text-neutral-950 ring-amber-300'
                                : 'bg-neutral-950 text-amber-500 ring-amber-500/40'
                            }`}
                          >
                            {barber.initials}
                          </div>

                          <p className="font-extrabold text-sm">{barber.name}</p>
                          <p
                            className={`text-[11px] mt-0.5 line-clamp-1 ${
                              isSelected ? 'text-neutral-300' : 'text-neutral-500'
                            }`}
                          >
                            {barber.role}
                          </p>
                          <span className="text-[11px] font-bold text-amber-500 mt-1 flex items-center gap-0.5">
                            ★ {barber.rating}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* PASO 4: HORARIO + DATOS DE CONTACTO PARA WHATSAPP */}
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-neutral-950 text-amber-500 font-black text-xs flex items-center justify-center">
                        4
                      </span>
                      <h3 className="text-lg font-extrabold text-neutral-950">Selecciona Horario</h3>
                    </div>
                    <span className="text-xs text-neutral-500 font-medium">Turnos de hoy</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {TIME_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`cursor-pointer py-3 px-3 rounded-xl border-2 font-extrabold text-xs sm:text-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? 'border-neutral-950 bg-neutral-950 text-white ring-2 ring-amber-500/60'
                              : 'border-neutral-200 bg-white text-neutral-800 hover:border-amber-500/60'
                          }`}
                        >
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{slot}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inputs limpios para enviar confirmación por WhatsApp */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                    <div>
                      <label className="text-xs font-bold text-neutral-600 block mb-1">
                        Tu Nombre
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Sebastián Rojas"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-neutral-950 focus:ring-2 focus:ring-amber-500/30 outline-none text-sm font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-neutral-600 block mb-1">
                        Tu WhatsApp (Para enviarte el ticket)
                      </label>
                      <input
                        type="tel"
                        placeholder="Ej. 943 123 456"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-neutral-950 focus:ring-2 focus:ring-amber-500/30 outline-none text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Resumen Pre-Confirmación y Botón Negro Sólido */}
                <div className="pt-2 space-y-4">
                  <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs sm:text-sm text-neutral-700 space-y-0.5">
                      <p className="font-extrabold text-neutral-950">
                        {currentSrvObj.name} con {currentBrbObj.name} ({currentBrbObj.badge})
                      </p>
                      <p className="text-xs text-neutral-500">
                        📍 {currentLocObj.shortName} • ⏰ {selectedTime} • ✨ Incluye mascarilla y
                        masaje
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-500 block">Total</span>
                      <span className="text-xl font-black text-neutral-950">
                        S/ {currentSrvObj.price}.00
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingWebhook}
                    className="cursor-pointer w-full py-4 px-6 rounded-2xl bg-neutral-950 text-white font-black text-base sm:text-lg tracking-tight shadow-[0_14px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-xl active:scale-[0.99] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70"
                  >
                    {isSendingWebhook ? (
                      <>
                        <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />
                        <span>Sincronizando con n8n &amp; WhatsApp...</span>
                      </>
                    ) : (
                      <>
                        <MessageCircle className="w-5 h-5 text-amber-500" />
                        <span>Confirmar Reserva Instantánea</span>
                        <ChevronRight className="w-5 h-5 text-amber-500" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* ====================================================================
          FOOTER CON BOTÓN DISCRETO DE "Login Admin"
      ==================================================================== */}
      <footer className="bg-white border-t border-neutral-200 py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-neutral-800">King&apos;s Barber Shop</span>
            <span>• Nuevo Chimbote &amp; Chimbote Centro</span>
          </div>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors font-semibold"
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Login Admin</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// VISTA 2: ADMIN CORE (Panel de Gestión, Monitor de Sillas, POS Migo SUNAT)
// ============================================================================
function AdminCoreView({
  chairs,
  setChairs,
  waitingQueue,
  setWaitingQueue,
  transactions,
  setTransactions,
  invoiceCounter,
  setInvoiceCounter,
  onBackToPublic
}) {
  const [activeTab, setActiveTab] = useState('monitor'); // 'monitor' | 'pos' | 'liquidacion'

  // Estado del Punto de Venta (POS)
  const [posCart, setPosCart] = useState([
    {
      id: 'vip',
      name: 'Servicio VIP (Mascarilla + Masaje incl.)',
      price: 40,
      qty: 1
    }
  ]);
  const [posBarberId, setPosBarberId] = useState('cristobal');
  const [posClientName, setPosClientName] = useState('Mateo Villavicencio');
  const [posClientDoc, setPosClientDoc] = useState('74829103');
  const [posClientPhone, setPosClientPhone] = useState('943 812 901');
  const [posChairOrigin, setPosChairOrigin] = useState(1);

  // Modal de Comprobante Electrónico Migo (SUNAT)
  const [sunatModalData, setSunatModalData] = useState(null);
  const [toast, setToast] = useState(null);

  const showNotification = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  // Reloj de segundos para el contador de las sillas ocupadas
  useEffect(() => {
    const interval = setInterval(() => {
      setChairs((prev) =>
        prev.map((chair) =>
          chair.status === 'busy'
            ? { ...chair, elapsedSeconds: chair.elapsedSeconds + 1 }
            : chair
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [setChairs]);

  // Asignar cliente de la lista de espera a una silla disponible
  const handleAssignToChair = (chairId) => {
    if (waitingQueue.length === 0) {
      showNotification('No hay clientes en la lista de espera.');
      return;
    }

    const [nextClient, ...restQueue] = waitingQueue;
    setChairs((prev) =>
      prev.map((c) =>
        c.chairId === chairId
          ? {
              ...c,
              status: 'busy',
              clientName: nextClient.clientName,
              serviceId: nextClient.serviceId,
              serviceName: nextClient.serviceName,
              price: nextClient.price,
              elapsedSeconds: 0,
              idleMinutes: 0
            }
          : c
      )
    );
    setWaitingQueue(restQueue);
    showNotification(`${nextClient.clientName} asignado a Silla ${chairId}.`);
  };

  // Enviar silla activa directo al Punto de Venta (POS) para cobrar y facturar
  const handleSendChairToPOS = (chair) => {
    setPosCart([
      {
        id: chair.serviceId || 'degradado',
        name: `${chair.serviceName} (Mascarilla + Masaje incl.)`,
        price: chair.price || 25,
        qty: 1
      }
    ]);
    setPosBarberId(chair.barberId);
    setPosClientName(chair.clientName || 'Cliente Varios');
    setPosChairOrigin(chair.chairId);
    setActiveTab('pos');
    showNotification(`Cuenta de ${chair.clientName} cargada en el POS.`);
  };

  // Agregar servicio o adicional al ticket del POS
  const handleAddItemToPOS = (item) => {
    setPosCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const handleUpdateQty = (id, delta) => {
    setPosCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const posTotal = posCart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const posSubtotal = +(posTotal / 1.18).toFixed(2);
  const posIgv = +(posTotal - posSubtotal).toFixed(2);

  // Cobrar y Emitir Comprobante vía Migo API (SUNAT)
  const handleEmitSunatInvoice = () => {
    if (posCart.length === 0) {
      showNotification('Agrega al menos un servicio al ticket antes de cobrar.');
      return;
    }

    const formattedCorrelative = `B001-${String(invoiceCounter).padStart(6, '0')}`;
    const barberObj = BARBERS.find((b) => b.id === posBarberId) || BARBERS[0];

    const newTx = {
      id: formattedCorrelative,
      barberId: barberObj.id,
      barberName: barberObj.name,
      clientName: posClientName || 'Cliente Varios',
      itemsDescription: posCart.map((i) => `${i.qty}x ${i.name}`).join(', '),
      total: posTotal,
      time: new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
    };

    setTransactions((prev) => [newTx, ...prev]);
    setInvoiceCounter((prev) => prev + 1);

    // Si venía de una silla ocupada, liberarla
    if (posChairOrigin) {
      setChairs((prev) =>
        prev.map((c) =>
          c.chairId === posChairOrigin
            ? {
                ...c,
                status: 'available',
                clientName: null,
                serviceId: null,
                serviceName: null,
                price: 0,
                elapsedSeconds: 0,
                idleMinutes: 1
              }
            : c
        )
      );
      setPosChairOrigin(null);
    }

    setSunatModalData({
      correlative: formattedCorrelative,
      clientName: posClientName || 'Cliente Varios',
      clientDoc: posClientDoc || '00000000',
      clientPhone: posClientPhone || '943 000 000',
      barberName: barberObj.name,
      items: [...posCart],
      subtotal: posSubtotal,
      igv: posIgv,
      total: posTotal,
      timestamp: new Date().toLocaleString('es-PE')
    });
  };

  // Cálculos de Liquidación Diaria
  const totalDayRevenue = transactions.reduce((sum, tx) => sum + tx.total, 0);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col">
      {/* Notificación flotante */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-950 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-amber-500/50 flex items-center gap-2.5 text-sm font-bold">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ====================================================================
          1. NAVBAR SUPERIOR DEL ADMIN CORE
      ==================================================================== */}
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-950 flex items-center justify-center ring-2 ring-amber-500">
              <Crown className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-neutral-950">KING&apos;S ADMIN CORE</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-500/40">
                  Migo SUNAT Ready
                </span>
              </div>
              <p className="text-xs text-neutral-500 hidden sm:block">
                Control de Operaciones, POS y Facturación Electrónica
              </p>
            </div>
          </div>

          {/* Pestañas de Navegación */}
          <nav className="flex items-center gap-1.5 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
            {[
              { id: 'monitor', label: 'Monitor de Sillas', icon: Monitor },
              { id: 'pos', label: 'Punto de Venta (POS)', icon: CreditCard },
              { id: 'liquidacion', label: 'Liquidación Diaria', icon: Wallet }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-neutral-950 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-950'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-amber-600'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={onBackToPublic}
            className="cursor-pointer px-3.5 py-2 rounded-xl border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Web Pública</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          CONTENIDO DINÁMICO SEGÚN PESTAÑA SELECCIONADA
      ==================================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 py-8 space-y-8">
        {/* ------------------------------------------------------------------
            SECCIÓN A: MONITOR DE SILLAS + LISTA DE ESPERA EN VIVO
        ------------------------------------------------------------------ */}
        {activeTab === 'monitor' && (
          <div className="space-y-8">
            {/* Resumen Rápido Superior */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Sillas Activas
                  </span>
                  <p className="text-2xl font-black text-neutral-950 mt-0.5">
                    {chairs.filter((c) => c.status === 'busy').length} de {chairs.length} ocupadas
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Scissors className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Cola de Espera (n8n + Local)
                  </span>
                  <p className="text-2xl font-black text-neutral-950 mt-0.5">
                    {waitingQueue.length} clientes listos
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Facturación Hoy (SUNAT)
                  </span>
                  <p className="text-2xl font-black text-neutral-950 mt-0.5">
                    S/ {totalDayRevenue}.00
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Cuadrícula de Sillas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-neutral-950">
                    Monitor de Sillas en Tiempo Real
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Supervisa el tiempo de atención de Cristóbal, Kevin y Brian
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {chairs.map((chair) => {
                  const isBusy = chair.status === 'busy';
                  return (
                    <div
                      key={chair.chairId}
                      className={`bg-white rounded-3xl border-2 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        isBusy
                          ? 'border-neutral-950 ring-1 ring-amber-500/40 shadow-md'
                          : 'border-neutral-200'
                      }`}
                    >
                      <div className="space-y-5">
                        {/* Cabecera de Silla */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-amber-500 font-black text-base flex items-center justify-center ring-2 ring-amber-500/50">
                              {chair.initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                                  {chair.chairName}
                                </span>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-500/30">
                                  {chair.barberRole}
                                </span>
                              </div>
                              <h3 className="text-lg font-black text-neutral-950">
                                {chair.barberName}
                              </h3>
                            </div>
                          </div>

                          <span
                            className={`text-xs font-extrabold px-3 py-1 rounded-full ${
                              isBusy
                                ? 'bg-neutral-950 text-amber-400'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-500/30'
                            }`}
                          >
                            {isBusy ? 'En Atención' : 'Disponible'}
                          </span>
                        </div>

                        {/* Estado Ocupado vs Disponible con Indicador de Tiempo Inactivo */}
                        {isBusy ? (
                          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-neutral-500">
                                Cliente actual:
                              </span>
                              <strong className="text-sm font-black text-neutral-950">
                                {chair.clientName}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-neutral-500">Servicio:</span>
                              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-500/30">
                                {chair.serviceName} (S/ {chair.price})
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-neutral-200">
                              <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-500" /> Tiempo activo:
                              </span>
                              <span className="font-mono font-black text-base text-neutral-950">
                                {formatTimer(chair.elapsedSeconds)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-amber-50/70 border-2 border-dashed border-amber-500/50 rounded-2xl p-4 text-center space-y-1.5">
                            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800">
                              <AlertCircle className="w-4 h-4 text-amber-600" />
                              <span>Tiempo inactivo: {chair.idleMinutes} min</span>
                            </div>
                            <p className="text-xs text-neutral-600">
                              Silla lista para recibir al siguiente cliente en espera.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Botón de Acción */}
                      <div className="mt-5 pt-4 border-t border-neutral-100">
                        {isBusy ? (
                          <button
                            type="button"
                            onClick={() => handleSendChairToPOS(chair)}
                            className="cursor-pointer w-full py-3.5 px-4 rounded-xl bg-neutral-950 text-white font-extrabold text-xs sm:text-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Receipt className="w-4 h-4 text-amber-500" />
                            <span>Pasar a POS y Facturar (S/ {chair.price})</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAssignToChair(chair.chairId)}
                            className="cursor-pointer w-full py-3.5 px-4 rounded-xl bg-neutral-950 text-white font-extrabold text-xs sm:text-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Play className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span>Asignar Siguiente Cliente</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lista de Espera en Vivo Debajo */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 rounded-full bg-neutral-950 text-amber-500 font-black text-xs">
                    {waitingQueue.length} EN COLA
                  </span>
                  <h3 className="text-lg font-black text-neutral-950">
                    Lista de Espera en Vivo (Webhooks n8n &amp; Local)
                  </h3>
                </div>
                <span className="text-xs text-neutral-500">
                  Las reservas de la Web Pública aparecen aquí automáticamente
                </span>
              </div>

              {waitingQueue.length === 0 ? (
                <div className="p-8 text-center text-sm text-neutral-500 bg-neutral-50 rounded-2xl border border-neutral-200">
                  No hay clientes en espera en este momento.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {waitingQueue.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between gap-3 transition-all hover:-translate-y-1 hover:shadow-lg ${
                        item.isNew
                          ? 'border-amber-500 bg-amber-50/40'
                          : 'border-neutral-200 bg-neutral-50/60'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-neutral-950">
                            #{index + 1} • {item.time}
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white border border-neutral-200 text-amber-600">
                            {item.source}
                          </span>
                        </div>
                        <p className="font-extrabold text-base text-neutral-950">
                          {item.clientName}
                        </p>
                        <p className="text-xs text-neutral-600">
                          {item.serviceName} • Barbero: <strong>{item.barberName}</strong>
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-neutral-200 flex items-center justify-between">
                        <span className="font-black text-sm text-neutral-950">
                          S/ {item.price}.00
                        </span>
                        <span className="text-[11px] text-neutral-500">{item.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SECCIÓN B: PUNTO DE VENTA (POS) Y FACTURACIÓN ELECTRÓNICA SUNAT
        ------------------------------------------------------------------ */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* COLUMNA IZQUIERDA (7 cols): Servicios y Adicionales para clickear */}
            <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block">
                    Catálogo Táctil Rápido
                  </span>
                  <h2 className="text-xl font-black text-neutral-950">
                    Selecciona Servicios para Agregar a la Cuenta
                  </h2>
                </div>
                <Scissors className="w-6 h-6 text-amber-500" />
              </div>

              {/* Servicios Principales */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                  Cortes &amp; Experiencias (Incluyen Mascarilla y Masaje)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {SERVICES.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() =>
                        handleAddItemToPOS({
                          id: srv.id,
                          name: `${srv.name} (Mascarilla + Masaje incl.)`,
                          price: srv.price
                        })
                      }
                      className="cursor-pointer p-4 rounded-2xl border-2 border-neutral-200 hover:border-neutral-950 bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] flex flex-col justify-between gap-3 group"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-base text-neutral-950">{srv.name}</span>
                          <Plus className="w-4 h-4 text-amber-500 group-hover:scale-125 transition-transform" />
                        </div>
                        <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{srv.subtitle}</p>
                      </div>
                      <span className="font-black text-base text-neutral-950 bg-amber-50 border border-amber-500/30 px-2.5 py-1 rounded-xl self-start">
                        S/ {srv.price}.00
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Adicionales y Productos */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                  Adicionales &amp; Productos de Barbería
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {POS_ADDONS.map((addon) => (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => handleAddItemToPOS(addon)}
                      className="cursor-pointer p-4 rounded-2xl border border-neutral-200 hover:border-neutral-950 bg-neutral-50/70 hover:bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] flex flex-col justify-between gap-2"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                        {addon.category}
                      </span>
                      <p className="font-bold text-sm text-neutral-900 leading-snug">
                        {addon.name}
                      </p>
                      <span className="font-extrabold text-sm text-neutral-950">
                        + S/ {addon.price}.00
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA (5 cols): Ticket / Cuenta + Botón Negro Gigante */}
            <div className="lg:col-span-5 bg-white border-2 border-neutral-950 rounded-3xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-neutral-950 text-amber-500 flex items-center justify-center">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 block">
                      Facturación Electrónica Migo
                    </span>
                    <h3 className="text-lg font-black text-neutral-950">
                      Ticket / Cuenta Actual
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold bg-neutral-100 px-2.5 py-1 rounded-lg">
                  B001-{String(invoiceCounter).padStart(6, '0')}
                </span>
              </div>

              {/* Datos del Cliente y Barbero */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200">
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 block mb-1">
                    Cliente (Boleta SUNAT)
                  </label>
                  <input
                    type="text"
                    value={posClientName}
                    onChange={(e) => setPosClientName(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-500 block mb-1">
                    Barbero Asignado
                  </label>
                  <select
                    value={posBarberId}
                    onChange={(e) => setPosBarberId(e.target.value)}
                    className="w-full bg-white border border-neutral-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-neutral-900 outline-none"
                  >
                    {BARBERS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.badge})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Lista de Ítems en el Ticket */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {posCart.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-6">
                    Haz clic en los servicios de la izquierda para agregarlos al comprobante.
                  </p>
                ) : (
                  posCart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-neutral-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-neutral-500">S/ {item.price}.00 c/u</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, -1)}
                          className="cursor-pointer w-6 h-6 rounded-lg bg-white border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black w-5 text-center">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQty(item.id, 1)}
                          className="cursor-pointer w-6 h-6 rounded-lg bg-white border border-neutral-300 flex items-center justify-center hover:bg-neutral-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-neutral-950 w-16 text-right">
                        S/ {(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Desglose Tributario SUNAT */}
              <div className="border-t border-neutral-200 pt-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-500">
                  <span>Op. Gravada (Subtotal)</span>
                  <span>S/ {posSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>IGV (18% SUNAT)</span>
                  <span>S/ {posIgv.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-base">
                  <span className="font-black text-neutral-950">TOTAL A COBRAR</span>
                  <span className="text-2xl font-black text-neutral-950">
                    S/ {posTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* BOTÓN NEGRO GIGANTE: "Cobrar y Emitir Comprobante" */}
              <button
                type="button"
                onClick={handleEmitSunatInvoice}
                className="cursor-pointer w-full py-5 px-6 rounded-2xl bg-neutral-950 text-white font-black text-base sm:text-lg tracking-tight shadow-[0_14px_30px_rgba(0,0,0,0.25)] hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 ring-2 ring-amber-500/80"
              >
                <FileCheck2 className="w-6 h-6 text-amber-500" />
                <span>Cobrar y Emitir Comprobante</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------
            SECCIÓN C: LIQUIDACIÓN DIARIA DE BARBEROS
        ------------------------------------------------------------------ */}
        {activeTab === 'liquidacion' && (
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block">
                  Cierre de Caja &amp; Comisiones
                </span>
                <h2 className="text-2xl font-black text-neutral-950">
                  Liquidación Diaria por Barbero
                </h2>
              </div>
              <div className="bg-neutral-950 text-white px-4 py-2.5 rounded-2xl flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold">Total Recaudado:</span>
                <span className="text-base font-black text-amber-400">
                  S/ {totalDayRevenue.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BARBERS.map((barber) => {
                const barberTxs = transactions.filter((t) => t.barberId === barber.id);
                const gross = barberTxs.reduce((sum, t) => sum + t.total, 0);
                const commission = gross * 0.5;
                return (
                  <div
                    key={barber.id}
                    className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-neutral-950 text-amber-500 font-black text-sm flex items-center justify-center">
                          {barber.initials}
                        </div>
                        <div>
                          <p className="font-black text-base text-neutral-950">{barber.name}</p>
                          <p className="text-xs text-neutral-500">{barber.role}</p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white border border-neutral-200">
                        {barberTxs.length} servicios
                      </span>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-neutral-500">Total facturado:</span>
                        <strong className="text-neutral-900">S/ {gross.toFixed(2)}</strong>
                      </div>
                      <div className="flex justify-between text-sm pt-1">
                        <span className="font-bold text-neutral-900">Comisión (50%):</span>
                        <strong className="font-black text-amber-600">
                          S/ {commission.toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Historial de Boletas Emitidas */}
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-black uppercase tracking-wider text-neutral-500">
                Últimos Comprobantes Electrónicos Emitidos (SUNAT)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                      <th className="py-3 px-4">Comprobante</th>
                      <th className="py-3 px-4">Hora</th>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Barbero</th>
                      <th className="py-3 px-4">Detalle</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-neutral-50">
                        <td className="py-3 px-4 font-mono font-bold text-amber-700">{tx.id}</td>
                        <td className="py-3 px-4 text-neutral-500">{tx.time}</td>
                        <td className="py-3 px-4 font-bold text-neutral-900">{tx.clientName}</td>
                        <td className="py-3 px-4 text-neutral-700">{tx.barberName}</td>
                        <td className="py-3 px-4 text-neutral-600">{tx.itemsDescription}</td>
                        <td className="py-3 px-4 text-right font-black text-neutral-950">
                          S/ {tx.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ====================================================================
          MODAL DE ÉXITO API MIGO (SUNAT): "Boleta Electrónica B001-000452 emitida con éxito"
      ==================================================================== */}
      {sunatModalData && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-white border-2 border-neutral-950 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-neutral-950 text-amber-500 ring-8 ring-amber-500/15 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-500/40 text-amber-700 text-[11px] font-black uppercase tracking-wider">
                Respuesta API Migo • SUNAT CDR Aceptado
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-neutral-950 leading-tight">
                Boleta Electrónica {sunatModalData.correlative} emitida con éxito
              </h3>
            </div>

            {/* Representación Impresa Compacta */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-neutral-200 pb-2">
                <span className="font-bold text-neutral-500">KING&apos;S BARBER SHOP S.A.C.</span>
                <span className="font-mono font-bold text-neutral-900">
                  {sunatModalData.correlative}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Cliente:</span>
                <strong className="text-neutral-900">{sunatModalData.clientName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Atendido por:</span>
                <strong className="text-neutral-900">{sunatModalData.barberName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">IGV (18%):</span>
                <span className="text-neutral-800">S/ {sunatModalData.igv.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm">
                <span className="font-black text-neutral-950">IMPORTE TOTAL:</span>
                <strong className="font-black text-amber-600">
                  S/ {sunatModalData.total.toFixed(2)}
                </strong>
              </div>
            </div>

            {/* Dos Botones Secundarios Solicitados: "Imprimir Ticket" y "Enviar al WhatsApp del cliente" */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  showNotification(
                    `🖨️ Enviando ${sunatModalData.correlative} a impresora térmica 80mm...`
                  );
                }}
                className="cursor-pointer py-3.5 px-4 rounded-xl border-2 border-neutral-950 text-neutral-950 font-extrabold text-xs sm:text-sm hover:bg-neutral-100 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-amber-600" />
                <span>Imprimir Ticket</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const text = encodeURIComponent(
                    `👑 *KING'S BARBER SHOP*\nComprobante Electrónico: *${sunatModalData.correlative}*\nTotal: *S/ ${sunatModalData.total.toFixed(
                      2
                    )}*\n¡Gracias por tu preferencia!`
                  );
                  window.open(`https://wa.me/51900000000?text=${text}`, '_blank');
                  showNotification('📲 Comprobante enviado al WhatsApp del cliente.');
                }}
                className="cursor-pointer py-3.5 px-4 rounded-xl bg-neutral-950 text-white font-extrabold text-xs sm:text-sm hover:bg-neutral-800 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-500" />
                <span>Enviar al WhatsApp del cliente</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSunatModalData(null);
                setPosCart([]);
              }}
              className="cursor-pointer text-xs font-bold text-neutral-500 hover:text-neutral-900 underline"
            >
              Cerrar y nueva venta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPONENTE RAÍZ (`App`): Conecta Web Pública y Admin Core mediante `currentView`
// ============================================================================
export default function App() {
  const [currentView, setCurrentView] = useState('public'); // 'public' | 'admin'
  const [chairs, setChairs] = useState(INITIAL_CHAIRS);
  const [waitingQueue, setWaitingQueue] = useState(INITIAL_WAITING_QUEUE);
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  // Inicia en 452 para que el primer comprobante emitido sea exactamente B001-000452
  const [invoiceCounter, setInvoiceCounter] = useState(452);

  const handleAddBookingFromPublic = (newBooking) => {
    setWaitingQueue((prev) => [newBooking, ...prev]);
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {currentView === 'public' ? (
        <PublicBookingView
          onNewBooking={handleAddBookingFromPublic}
          onOpenAdmin={() => setCurrentView('admin')}
        />
      ) : (
        <AdminCoreView
          chairs={chairs}
          setChairs={setChairs}
          waitingQueue={waitingQueue}
          setWaitingQueue={setWaitingQueue}
          transactions={transactions}
          setTransactions={setTransactions}
          invoiceCounter={invoiceCounter}
          setInvoiceCounter={setInvoiceCounter}
          onBackToPublic={() => setCurrentView('public')}
        />
      )}
    </div>
  );
}
