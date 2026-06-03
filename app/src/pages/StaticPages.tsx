import { useParams, Navigate, Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Reveal } from '../components/Motion';
import { SITE, asset, getProduct } from '../lib/data';
import refundMd from '../data/refund-policy.md?raw';
import shippingMd from '../data/shipping-policy.md?raw';

/* ---------------------------------- About ---------------------------------- */
export function About() {
  const hero = getProduct('jean-jacket') || getProduct('rhinestone-shirt');
  const story = [
    'From the heart of Brooklyn, New York — where culture, rhythm and resilience collide — comes a clothing brand that’s more than just fabric and thread. It’s a movement. A statement. A lifestyle.',
    'Founded by a multi-talented artist in the music industry — a singer, producer and instrumentalist — this brand was born from the same fire that fuels every beat, every lyric, every late-night studio session. Music runs in our veins, but fashion is our voice.',
    'We believe luxury shouldn’t come with an impossible price tag. That’s why we’re redefining high-end streetwear by creating luxury-inspired pieces that are accessible, expressive and unapologetically original. Every stitch tells a story — of hustle, passion and the relentless pursuit of dreams.',
    'A portion of every drop goes straight back into supporting the founder’s music journey — turning fashion into fuel for the dream. Whether you’re walking the city streets or chasing your own passion, wear what speaks for you.',
  ];
  return (
    <>
      <Seo title="Our Story" description="Born in Brooklyn, built for the bold. The Veelux story — where music meets fashion." path="/about" image={hero?.imagePaths[0]} />
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        {hero && <img src={asset(hero.imagePaths[0])} alt="Veelux — Brooklyn streetwear" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian to-transparent" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-5">
          <Reveal>
            <p className="label mb-5">Born in Brooklyn · Built for the Bold</p>
            <h1 className="display text-5xl sm:text-8xl">Our <span className="shimmer-text">Story</span></h1>
          </Reveal>
        </div>
      </section>
      <article className="mx-auto max-w-2xl px-5 sm:px-8 mt-20 space-y-7">
        {story.map((p, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <p className="text-lg leading-relaxed text-bone-dim">{p}</p>
          </Reveal>
        ))}
        <Reveal>
          <p className="display text-2xl sm:text-3xl pt-6">Where music meets fashion. And passion pays the price.</p>
          <Link to="/collections/all" className="inline-block mt-8 border hairline px-9 py-4 label text-bone hover:bg-bone hover:text-obsidian transition-colors duration-500">
            Shop the Drop
          </Link>
        </Reveal>
      </article>
    </>
  );
}

/* --------------------------------- Contact --------------------------------- */
export function Contact() {
  return (
    <>
      <Seo title="Contact" description={`Get in touch with the Veelux team — ${SITE.email}.`} path="/contact" />
      <div className="mx-auto max-w-3xl px-5 sm:px-8 pt-20 sm:pt-28">
        <Reveal>
          <p className="label mb-5">Get in touch</p>
          <h1 className="display text-5xl sm:text-7xl">Contact</h1>
          <p className="mt-7 text-bone-dim max-w-lg leading-relaxed">
            Questions about a drop, sizing, or an order? Reach the Veelux team directly — we’ve got you.
          </p>
        </Reveal>

        <form
          className="mt-12 grid gap-6"
          action={`mailto:${SITE.email}`}
          method="post"
          encType="text/plain"
        >
          <Field label="Name" name="name" />
          <Field label="Email" name="email" type="email" required />
          <Field label="Phone (optional)" name="phone" type="tel" />
          <div>
            <label className="label block mb-3">Message</label>
            <textarea name="message" rows={5} required className="w-full bg-obsidian-2 border hairline px-4 py-3 text-bone focus:border-bone outline-none transition-colors" />
          </div>
          <button type="submit" className="justify-self-start bg-bone text-obsidian px-10 py-4 label hover:bg-shimmer transition-colors">
            Send Message
          </button>
        </form>

        <div className="mt-16 border-t hairline pt-8 flex flex-wrap gap-x-12 gap-y-4">
          <div>
            <p className="label text-bone-faint mb-1">Email</p>
            <a href={`mailto:${SITE.email}`} className="link-underline hover:text-bone">{SITE.email}</a>
          </div>
          <div>
            <p className="label text-bone-faint mb-1">Studio</p>
            <p>{SITE.city}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({ label, name, type = 'text', required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="label block mb-3">{label}</label>
      <input type={type} name={name} required={required} className="w-full bg-obsidian-2 border hairline px-4 py-3 text-bone focus:border-bone outline-none transition-colors" />
    </div>
  );
}

/* --------------------------------- Policies -------------------------------- */
const POLICIES: Record<string, { title: string; body: string }> = {
  'refund-policy': { title: 'Returns & Refunds', body: refundMd },
  'shipping-policy': { title: 'Shipping', body: shippingMd },
};

export function Policy() {
  const { handle = '' } = useParams();
  const policy = POLICIES[handle];
  if (!policy) return <Navigate to="/" replace />;
  const [, ...rest] = policy.body.split('\n').map((l) => l.trim());
  const paras = rest.filter(Boolean);
  return (
    <>
      <Seo title={policy.title} description={`${policy.title} — VEELUX. ${paras[0]?.slice(0, 140) || ''}`} path={`/policies/${handle}`} />
      <div className="mx-auto max-w-2xl px-5 sm:px-8 pt-20 sm:pt-28">
        <Reveal>
          <p className="label mb-5">Policy</p>
          <h1 className="display text-4xl sm:text-6xl">{policy.title}</h1>
        </Reveal>
        <article className="mt-12 space-y-5">
          {paras.map((p, i) => (
            <p key={i} className={/^[A-Z][a-z].{0,40}$/.test(p) && p.length < 42 ? 'label pt-4' : 'text-bone-dim leading-relaxed'}>{p}</p>
          ))}
        </article>
        <p className="mt-12 label text-bone-faint">Questions? <a href={`mailto:${SITE.email}`} className="link-underline hover:text-bone">{SITE.email}</a></p>
      </div>
    </>
  );
}
